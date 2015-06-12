# kindle2EvernoteSync
Re-writing "kindleToEvernoteSync" for Node.js

# Desired Control Flow

1. Plug in Kindle with USB

2. Kindle is recognized and kindle-clippings from from Kindle is (renamed?) transferred to Dropbox folder /books. (automator)

3. File from Dropbox is read, parsed, and pushed to Kindle Web API (node.js app)

4. Open terminal or Evernote or browser and show process progress. (?)

4. Notify and show when the Process has been completed. (alert from js app)

