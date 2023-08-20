GIT GUIDELINES
==============

<small>**Last updated on 21/03/2023**</small>

### Index
1) Commits are regular and effective
2) Use branches, correctly
3) Why we use GIT
4) When GIT doesn't work
5) Quick guide

<hr>

### 1) Commits are regular and effective

Commits should be made, at a bare minimum, every 1 full day (7.5hrs) of effort. General guidelines are:

- On a project, building blocks, a commit should be made on completion of every block, or every day (if a block is not finished within a day). 
- On a project, fixing bugs, a commit should be made at a bare minimum once every 5 tickets. Ideally we would have commit for every fix, but we understand that some tickets are smaller and this can get unruly. 
- If you are pausing a project at any point (middle of a ticket, middle of a block) to do other work or for an extended break (end of the day, holiday, weekend, etc…) you should make a commit and push it to a branch other than master. 
- Commit names should be concise, descriptive, but don’t spend too much time thinking of them! No vulgar language! No complaining! Write commit messages as if the client, your mum and the pope are watching..
 
<hr>

### 2) Use branches, correctly

- Always branch from the master branch. If you are not currently on master and you create a new branch, the branch will be a branch of the branch you are on, not master. You can see which branch you are on using ‘git status’
- Do not work on stale branches: If you’ve stepped away from the project for a while, or even a day or so, check to see what’s going on master. If necessary pull from master into your branch. To do this:
  - Switch to master (git checkout master)
  - Pull master from origin (git pull origin master)
  - Switch back to your branch (git checkout branch-name)
  - Merge in master (git merge master)
- Ensure your branch is synced with origin. Push with every commit!
- For branch names, use lowercase only, you can use dashes (-) and forward slashes (/). Branch names can include;
  - Your name/Your team name
  - The date
  - Description of the feature you’re working on
- Don’t work on master!

<hr>

### 3) Why we use GIT
  
In order to work efficiently and meet customer deadlines, it is sometimes critical that multiple developers work on the same project at the same time. Unfortunately, that gives us a key problem, if two people have worked on the same file, the person to push to the server last will erase the changes of everyone else.

It is also very important to track when changes are made to files and who made them, so we can attribute certain change requests, feature requests or bug fixes to changes in the live site. This means when changing code, we can know why the code was written like it is in the first place.

<hr>

### 4) When GIT doesn’t work

#### When there are too many changes
GIT works better when commits are made in small increments. If commits are made after large amounts of changes or work is done on a project, it is no longer easy to merge or identify where the changes came from or why they were made.

#### When used with automatic code formatters
Automatic code formatters break GIT. If you change a file from 2 spaces to 4 spaces for example, it will change every line in the eyes of GIT. This means when it comes to merge, GIT won’t know who’s code to use and will produce a merge conflict or worse, it will just choose the version of the file from whoever edited it last.

#### When the chronology of changes are messed up
For example, Team A makes a change, the change is merged into Team B’s branch and Team B works on it. Then Team A makes another change, but doesn’t pull Team B’s changes in. Again this messes up GIT’s automatic merging system. It could also result in duplication of effort as Team A may fix a bug that Team B have already fixed for example.

<hr>

### 5) Quick guide
- Always work on an updated local copy, pull from origin as there might be changes for you to pull
- When building blocks, 1 commit per block or every day (if block is not finished within a day)
- When fixing bugs, a commit should be made at a bare minimum once every 5 tickets
- Write commit messages that briefly describe the work that was done

#### Naming conventions

- **Plugin** - when one or multiple plugins are added/updated (composer or NPM)
- **Feature** - a new feature introduced (i.e. a new block)
- **Fix** - for fixing bugs (it's good practice to describe what the issue was)
- **Refactor** - for significant changes made to a feature, either functionality or code structure
- **Tweak** - pretty much any other action like improvements, style changes, config options, utilities created, etc...

#### Examples

    Tweak (Post Carousel) - adds responsive rules

    Tweak (Feed) - adds new layout for "Resources" post type

    Tweak - clean up of commented out code and console logs.

    Tweak - updates typography styles. Changes button hover styles. Updates vertical spacing on Spacer block.

    Tweak - renames ACF labels on Hero Header and Video blocks.
    
    Tweak - adds minor style tweaks to Icons, Header, Carousel blocks
    
    Tweak - updates typography styles. Changes button hover styles. Updates vertical spacing on Spacer block.
    
    Feature - adds Hero Header block
    
    Feature - adds Footer
    
    Fix (Hero Header) - when outputting long lines of text, it was overlapping the container
    
    Fix (Footer) - removes gap that was appearing on mobile breakpoint
    
    Refactor (Post Carousel) - adds ability to filter posts by taxonomy. Changes style of post items in the carousel.
    
    Refactor (Hero Header) - re-writes block to separate html structure into smaller partials
    
    Plugin - adds Redirection plugin
    
    Plugin - adds VueJS, Vuex, Vue Router and Axios plugins

<hr>

End