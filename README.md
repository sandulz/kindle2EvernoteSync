# kindle2EvernoteSync
Re-writing "kindleToEvernoteSync" for Node.js

# Desired Control Flow

1. Plug in Kindle with USB

2. Kindle is recognized and kindle-clippings from  Kindle is transferred to Dropbox/books/kindeClippings folder and renamed newClippings. (automator)

3. File from Dropbox is read, parsed, and pushed to Kindle Web API (node.js app)

4. Progress gets logged into terminal as node runs

4. Notify and show when the Process has been completed. (alert in browser or logged in terminal)

