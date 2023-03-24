// import db from '../database';
// import topics from '../topics';
// import plugins from '../plugins';

// interface PostObject {
//     resolve : (pid:number) => Promise<boolean>;
//     unresolve : (pid:number) => Promise<boolean>;
//     getPostFields: (pid:number, fields:string[]) => Promise<PostObject>;
//     resolved : (pid: number) => Promise<boolean>;
// }

// export = function (Posts:PostObject) {
//     async function toggleResolve(type:string, pid:number) {
//         const isResolving = type == 'resolve';
//         const [postData, resolved]:[PostObject, boolean] = await Promise.all([
//             Posts.getPostFields(pid, ['pid', 'uid']),
//             Posts.resolved(pid),
//         ]);

//         if (isResolving && resolved) {
//             throw new Error('[[error: already resolved]]');
//         }

//         if (!isResolving && !resolved) {
//             throw new Error('[[error: already unresolved]]');
//         }

//         await plugins.hooks.fire(`action:post.${type}`, {
//             pid: pid,
//             current: resolved ? 'resolve' : 'unresolve',
//         });

//         return resolved;
//     }

//     Posts.resolve = async function (pid:number) {
//         return await toggleResolve('resolve', pid);
//     }

//     Posts.unresolve = async function (pid:number) {
//         return await toggleResolve('unresolve', pid);
//     }

// }
