import validator = require('validator');
import _ = require('lodash');

import post = require('../posts');
import topics = require('../topics');
import user = require('../user')
import plugins = require('../plugins');
import categories = require('../categories');
import utils = require('../utils');
// import { CategoryObject, TopicObject, PostObject } from '../types';

type option = {
    stripTags: boolean;
    parse: boolean;
    extraFields: string[];
  };

interface PostObjectNew {
    user: string;
    uid: number;
    handle: undefined;
    topic: topics;
    tid: number;
    category: string;
    cid: number;
    isMainPost: boolean;
    pid: number;
    timestampISO: Date;
    timestamp: string;
    deleted;
    content: string;
}

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
        // eslint-disable-next-line
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        const uids: number[] = _.uniq(posts.map(p => p && p.uid)) as number[];
        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        const tids: string[] = _.uniq(posts.map(p => p && p.tid)) as string[];

        async function getTopicAndCategories(tids: string[]) {
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const topicsData: topics[] = await topics.getTopicsFields(tids, [
                'uid', 'tid', 'title', 'cid', 'tags', 'slug',
                'deleted', 'scheduled', 'postcount', 'mainPid', 'teaserPid',
            ]) as topics[];
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            const cids: string[] = _.uniq(topicsData.map(topic => topic && topic.cid)) as string[];
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const categoriesData: string[] = await categories.getCategoriesFields(cids, [
                'cid', 'name', 'icon', 'slug', 'parentCid',
                'bgColor', 'color', 'backgroundImage', 'imageClass',
            ]) as string[];
            return { topics: topicsData as string[], categories: categoriesData };
        }

        const [users, topicsAndCategories] = await Promise.all([
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            user.getUsersFields(uids, ['uid', 'username', 'userslug', 'picture', 'status']) as string[],
            getTopicAndCategories(tids),
        ]);

        function toObject(key: string, data: string[]) {
            const obj = {};
            for (let i = 0; i < data.length; i += 1) {
                obj[data[i][key] as string] = data[i];
            }
            return obj as Map<string, string[]>;
        }

        function stripTags(content) {
            if (content) {
                return utils.stripHTMLTags(content, utils.stripTags);
            }
            return content as string;
        }

        async function parsePosts(posts, options: option) {
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            return await Promise.all(posts.map(async (post: PostObjectNew) => {
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                if (!post.content || !options.parse) {
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    post.content = post.content ? validator.escape(String(post.content)) as string : post.content;
                    return post;
                }
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                post = await Posts.parsePost(post) as PostObjectNew;
                if (options.stripTags) {
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    post.content = stripTags(post.content);
                }
                return post;
            }));
        }

        const uidToUser = toObject('uid', users);
        const tidToTopic = toObject('tid', topicsAndCategories.topics);
        const cidToCategory = toObject('cid', topicsAndCategories.categories);

        posts.forEach((post: PostObjectNew) => {
            // If the post author isn't represented in the retrieved users' data,
            // then it means they were deleted, assume guest.
            // might be able to manipulate this to make anonymous post
            if (!uidToUser.hasOwnProperty(post.uid)) {
                post.uid = 0;
            }
            post.user = uidToUser[post.uid] as string;

            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            Posts.overrideGuestHandle(post, post.handle);
            post.handle = undefined;
            post.topic = tidToTopic[post.tid] as string;
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            post.category = post.topic && cidToCategory[post.topic.cid] as string;
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            post.isMainPost = post.topic && post.pid === post.topic.mainPid as number;
            post.deleted = post.deleted === 1;
            post.timestampISO = utils.toISOString(post.timestamp) as Date;
        });

        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        posts = posts.filter(post => tidToTopic[post.tid] as string);

        posts = await parsePosts(posts, options);
        // The next line calls a function in a module that has not been updated to TS yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return (await plugins.hooks.fire('filter:post.getPostSummaryByPids', { posts: posts, uid: uid })).posts as string[];
    };
};
