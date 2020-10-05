#/bin/bash

cd $(dirname $0)

# delete root repos
pushd ../
rm -rf repos
popd

# reset git repos
pushd git/data

rm -rf repos
mkdir repos

export GIT_AUTHOR_NAME="dockhand"
export GIT_AUTHOR_EMAIL="dockhand@example.com"
export GIT_COMMITTER_NAME="dockhand"
export GIT_COMMITTER_EMAIL="dockhand@example.com"

IFS=$'\n'
for i in $(ls -1 repos.template); do
  cp -r "repos.template/$i" "repos"
  git init "repos/$i"
  mkdir "repos/$i.git"
  git init --bare "repos/$i.git"
  pushd "repos/$i"
  git remote add origin "../$i.git"
  git add --all
  git commit -m "initial commit"
  git push origin master
  popd
done
unset $IFS

popd

# done
