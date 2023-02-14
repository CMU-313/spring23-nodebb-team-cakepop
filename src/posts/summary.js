"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const _ = require("lodash");
const topics = require("../topics");
const user = require("../user");
const plugins = require("../plugins");
const categories = require("../categories");
const utils = require("../utils");
module.exports = function (Posts) {
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    Posts.getPostSummaryByPids = function (pids, uid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(pids) || !pids.length) {
                return [];
            }
            options.stripTags = options.hasOwnProperty('stripTags') ? options.stripTags : false;
            options.parse = options.hasOwnProperty('parse') ? options.parse : true;
            options.extraFields = options.hasOwnProperty('extraFields') ? options.extraFields : [];
            const fields = ['pid', 'tid', 'content', 'uid', 'timestamp', 'deleted', 'upvotes', 'downvotes', 'replies', 'handle'].concat(options.extraFields);
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            let posts = yield Posts.getPostsFields(pids, fields);
            posts = posts.filter(Boolean);
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            posts = (yield user.blocks.filter(uid, posts));
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            const uids = _.uniq(posts.map(p => p && p.uid));
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            const tids = _.uniq(posts.map(p => p && p.tid));
            function getTopicAndCategories(tids) {
                return __awaiter(this, void 0, void 0, function* () {
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    const topicsData = yield topics.getTopicsFields(tids, [
                        'uid', 'tid', 'title', 'cid', 'tags', 'slug',
                        'deleted', 'scheduled', 'postcount', 'mainPid', 'teaserPid',
                    ]);
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
                    const cids = _.uniq(topicsData.map(topic => topic && topic.cid));
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    const categoriesData = yield categories.getCategoriesFields(cids, [
                        'cid', 'name', 'icon', 'slug', 'parentCid',
                        'bgColor', 'color', 'backgroundImage', 'imageClass',
                    ]);
                    return { topics: topicsData, categories: categoriesData };
                });
            }
            const [users, topicsAndCategories] = yield Promise.all([
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                user.getUsersFields(uids, ['uid', 'username', 'userslug', 'picture', 'status']),
                getTopicAndCategories(tids),
            ]);
            function toObject(key, data) {
                const obj = {};
                for (let i = 0; i < data.length; i += 1) {
                    obj[data[i][key]] = data[i];
                }
                return obj;
            }
            function stripTags(content) {
                if (content) {
                    return utils.stripHTMLTags(content, utils.stripTags);
                }
                return content;
            }
            function parsePosts(posts, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    // The next line calls a function in a module that has not been updated to TS yet
                    // eslint-disable-next-line
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
                    return yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                        // The next line calls a function in a module that has not been updated to TS yet
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                        if (!post.content || !options.parse) {
                            // The next line calls a function in a module that has not been updated to TS yet
                            // eslint-disable-next-line
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            post.content = post.content ? validator.escape(String(post.content)) : post.content;
                            return post;
                        }
                        // The next line calls a function in a module that has not been updated to TS yet
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                        post = (yield Posts.parsePost(post));
                        if (options.stripTags) {
                            // The next line calls a function in a module that has not been updated to TS yet
                            // eslint-disable-next-line
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            post.content = stripTags(post.content);
                        }
                        return post;
                    })));
                });
            }
            const uidToUser = toObject('uid', users);
            const tidToTopic = toObject('tid', topicsAndCategories.topics);
            const cidToCategory = toObject('cid', topicsAndCategories.categories);
            posts.forEach((post) => {
                // If the post author isn't represented in the retrieved users' data,
                // then it means they were deleted, assume guest.
                // might be able to manipulate this to make anonymous post
                if (!uidToUser.hasOwnProperty(post.uid)) {
                    post.uid = 0;
                }
                post.user = uidToUser[post.uid];
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                Posts.overrideGuestHandle(post, post.handle);
                post.handle = undefined;
                post.topic = tidToTopic[post.tid];
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                post.category = post.topic && cidToCategory[post.topic.cid];
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                post.isMainPost = post.topic && post.pid === post.topic.mainPid;
                post.deleted = post.deleted === 1;
                post.timestampISO = utils.toISOString(post.timestamp);
            });
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            posts = posts.filter(post => tidToTopic[post.tid]);
            posts = yield parsePosts(posts, options);
            // The next line calls a function in a module that has not been updated to TS yet
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            return (yield plugins.hooks.fire('filter:post.getPostSummaryByPids', { posts: posts, uid: uid })).posts;
        });
    };
};
