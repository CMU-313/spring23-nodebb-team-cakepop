# Team Cakepop Project 1 User Guide
### Alexander Isparyan, Om Patel, Samiul Hoque, Emme Wetzel, Maddie Thai-Tang

## Search Feature
This feature adds a search bar to the top right of the screen and allows for the user
to search through existing posts. In order to accomplish this, we added a plugin which
has been activated by default, so there should be no work on the part of the user to
ensure that it works.<br>

**How to use it**
1. Run `$ ./nodebb setup`
2. Run `$ ./nodebb build`
3. Run `$ ./nodebb start`
4. Open NodeBB in browser
5. Create account on NodeBB so that you can create posts (or log in to existing account)
6. Create several posts with key words that you would like to search with
7. After creating these posts, try searching for terms as you see fit and see how 
relevant posts appear after searches are performed.<br>

**How did we test?**<br>
We did not implement automated tests for this specific functionality. The primary reason 
is that we simply activated an existing plugin that had existing tests in place already. 
Upon inspection of these tests in the testing files, it became evident that the work 
was done for us and there was no need to add extra testing for now. In order to test if 
the plugin is automatically activated, we run `$ ./nodebb build` and notice how the 
console added a line saying that the search plugin has been set to active. Additionally, 
we were able to visually confirm that the search bar had both appeared and worked as
expected through manual testing (much like you can do).<br><br>


## Toggle Resolved Button
This button was added to posts and threads to mark them as resolved to avoid unclosed 
posts and assist in organizing the posts on the site. In these two sprints, only the UI 
aspect of the button has been implemented. Clicking the button still does not mark the
post as resolved.<br>

**How to use it**
1. Run `$ ./nodebb setup`
2. Run `$ ./nodebb build`
3. Run `$ ./nodebb start`
4. Open NodeBB in browser
5. Create account on NodeBB so that you can create a post (or log in to existing account)
6. Create a new post and go to that post's page
7. Note how at the top right menu of icons near the reply button, there is now a 
checkmark that is meant to mark a post thread as resolved. You may click the button, 
but as of right now it is not fully functional and will not do anything.<br>

**How did we test?**<br>
For the UI of NodeBB, there is not a good way to test through automated testing whether
something appears to the user. However, we have tested this manually by creating posts
in various categories as various users to ensure that the button to toggle a post as
resolved indeed appears.<br><br>


## Posting Anonymously
This feature allows a user to create a post anonymously such that their username and
profile photo are obscured. This is mostly implemented, but there still of course may
be areas for improvement or oversights on our end.<br>

**How to use it**
1. Run `$ ./nodebb setup`
2. Run `$ ./nodebb build`
3. Run `$ ./nodebb start`
4. Open NodeBB in browser
5. Create account on NodeBB so that you can create a post (or log in to existing account)
6. Create a new post, and instead of pressing the usual submit button, select "Post
Anonymously" (this will still post, but it will remove the features that make the user
identifiable)
7. Your post is created!<br><br>
*The Anonymous button has not been fully implemented due to difficulties syncing frontend functionality with backend functionality. While the profile and username can be hidden
when tested separately, the submit button has not been fully implemented.

**How did we test?**<br>
We added to the overall testing suite that is already enabled through GitHub actions.
You can view the added tests [here](https://github.com/CMU-313/spring23-nodebb-team-cakepop/commit/3750b0d4cfb5cd92f2a76552ba982856a1a4f28b). These tests cover whether an anonymous post
is successfully created in such a way that other users cannot view the poster's information.
We believe that these tests are sufficient we account for all edge cases that could arise.
Right now, our coverage is low due to an issue that we had fixed, but has re-appeared out of
nowhere. However, we know that we can run NodeBB in the browser with no issues whatsoever,
so we are unconcerned that there will be major issues in using the website itself.
