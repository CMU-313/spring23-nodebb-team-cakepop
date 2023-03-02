# Team Cakepop Project 1 User Guide
### Alexander Isparyan, Om Patel, Samiul Hoque, Emme Wetzel, Maddie Thai-Tang

## Search Feature
This feature adds a search bar to the top right of the screen and allows for the user
to search through existing posts. In order to accomplish this, we added a plugin which
has been activated by default, so there should be no work on the part of the user to
ensure that it works.<br>

**You Test!**
1. Run `$ ./nodebb setup`
2. Run `$ ./nodebb build`
3. Run `$ ./nodebb start`
4. Open NodeBB in browser and create several posts with key words that you would like 
to search with.
5. After creating these posts, try searching for terms as you see fit and see how 
relevant posts appear after searches are performed.<br>

**How did we test?**
We did not implement automated tests for this specific functionality. The primary reason 
is that we simply activated an existing plugin that had existing tests in place already. 
Upon inspection of these tests in the testing files, it became evident that the work 
was done for us and there was no need to add extra testing for now. In order to test if 
the plugin is automatically activated, we run `$ ./nodebb build` and notice how the 
console added a line saying that the search plugin has been set to active. Additionally, 
we were able to visually confirm that the search bar had both appeared and worked as
expected through manual testing (much like you can do).