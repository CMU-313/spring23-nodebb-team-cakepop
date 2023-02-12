import validator = require('validator');
import _ = require('lodash');

import post = require('../posts');
import topics = require('../topics');
import user = require('../user')
import plugins = require('../plugins');
import categories = require('../categories');
import utils = require('../utils');
// import { CategoryObject, TopicObject } from '../types';

type option = {
    stripTags: boolean;
    parse: boolean;
    extraFields: string[];
  };

module.exports = function (Posts) {
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    Posts.getPostSummaryByPids = async function (pids: string[], uid: string, options: option) {
        if (!Array.isArray(pids) || !pids.length) {
            return [];
        }

        options.stripTags = options.hasOwnProperty('stripTags') ? options.stripTags : false;
        options.parse = options.hasOwnProperty('parse') ? options.parse : true;
        options.extraFields = options.hasOwnProperty('extraFields') ? options.extraFields : [];

        const fields = ['pid', 'tid', 'content', 'uid', 'timestamp', 'deleted', 'upvotes', 'downvotes', 'replies', 'handle'].concat(options.extraFields);

        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        let posts = await Posts.getPostsFields(pids, fields) as post[];
        posts = posts.filter(Boolean);
        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        posts = await user.blocks.filter(uid, posts) as post[];

        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const uids: string[] = _.uniq(posts.map(p => p && p.uid)) as string[];
        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const tids: string[] = _.uniq(posts.map(p => p && p.tid)) as string[];

        const [users, topicsAndCategories] = await Promise.all([
            user.getUsersFields(uids, ['uid', 'username', 'userslug', 'picture', 'status']),
            getTopicAndCategories(tids),
        ]);

        const uidToUser = toObject('uid', users);
        const tidToTopic = toObject('tid', topicsAndCategories.topics);
        const cidToCategory = toObject('cid', topicsAndCategories.categories);

        posts.forEach((post) => {
            // If the post author isn't represented in the retrieved users' data,
            // then it means they were deleted, assume guest.
            if (!uidToUser.hasOwnProperty(post.uid)) {
                post.uid = 0;
            }
            post.user = uidToUser[post.uid] as string;
            Posts.overrideGuestHandle(post, post.handle);
            post.handle = undefined;
            post.topic = tidToTopic[post.tid] as string;
            post.category = post.topic && cidToCategory[post.topic.cid] as string;
            post.isMainPost = post.topic && post.pid === post.topic.mainPid as boolean;
            post.deleted = post.deleted === 1 as number;
            post.timestampISO = utils.toISOString(post.timestamp);
        });

        posts = posts.filter(post => tidToTopic[post.tid] as string);

        posts = await parsePosts(posts, options);
        return (await plugins.hooks.fire('filter:post.getPostSummaryByPids', { posts: posts, uid: uid })).posts as string[];
    };

    async function parsePosts(posts, options) {
        return await Promise.all(posts.map(async (post) => {
            if (!post.content || !options.parse) {
                post.content = post.content ? validator.escape(String(post.content)) : post.content;
                return post;
            }
            post = await Posts.parsePost(post);
            if (options.stripTags) {
                post.content = stripTags(post.content);
            }
            return post;
        }));
    }

    async function getTopicAndCategories(tids: string[]) {
        const topicsData = await topics.getTopicsFields(tids, [
            'uid', 'tid', 'title', 'cid', 'tags', 'slug',
            'deleted', 'scheduled', 'postcount', 'mainPid', 'teaserPid',
        ]);
        const cids: string[] = _.uniq(topicsData.map(topic => topic && topic.cid));
        const categoriesData: string[] = await categories.getCategoriesFields(cids, [
            'cid', 'name', 'icon', 'slug', 'parentCid',
            'bgColor', 'color', 'backgroundImage', 'imageClass',
        ]);
        return { topics: topicsData, categories: categoriesData };
    }

    function toObject(key: string, data: string[]) {
        const obj = {};
        for (let i = 0; i < data.length; i += 1) {
            obj[data[i][key]] = data[i];
        }
        return obj as Map<string, string[]>;
    }

    function stripTags(content) {
        if (content) {
            return utils.stripHTMLTags(content, utils.stripTags);
        }
        return content;
    }
};
