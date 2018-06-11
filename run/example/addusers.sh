#!/bin/sh

IFS=$'\n'
for line in `cat userlist`; do
  test -z "$line" && continue
  user=`echo $line | cut -f 1 -d' '`
  echo "adding user $user"     # the classification part (admin/...)
  useradd -m -s /bin/bash $user
done


# Using a read instead
#while read userlist; do
# test -z "$userlist" && continue
# user=`echo $userlist | cut -f 1 -d' '`
# echo "adding user $user"
# useradd -m -s /bin/bash $user
#done
