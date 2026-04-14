# CanvasDeck
A web application that creates a deck dashboard for Canvas and also integrates other applications such as Gmail, YouTube, Spotify, and more.

For the front end dependencies

cd client
npm install

Backend

cd ../server
npm install

Start Frontend
cd client
npm run dev
runs on: http://localhost:5173

Start Express Backend
cd server
npm run dev
runs on: http://localhost:3000

# git for the dummies

check your branch
git branch

switch branch to *branch_name*, -b to make new branch
git switch *branch_name*
or below, -c to make a new branch
git checkout *branch_name*

stage changes
git add .

commit
git commit -m "msg"

push/first push
git push
git push -u origin *branch_name*

workflow:

git add .
git commit -m "msg"
git push

eb deploy (updates aws deployment manually)