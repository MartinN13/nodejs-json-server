#!/bin/bash 

verbose=0

if [[ $@ = "--verbose" ]]; then
  verbose=1
fi

echo "Testing route 'localhost:1337'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337
fi
echo
echo

echo "Testing route 'localhost:1337/room/list'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/list

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/list
fi
echo
echo

echo "Testing route 'localhost:1337/room/list?max=2'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/list?max=2

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/list?max=2
fi
echo
echo

echo "Testing route 'localhost:1337/room/id/2-116'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/view/id/2-116

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/view/id/2-116
fi
echo
echo

echo "Testing route 'localhost:1337/room/view/house/A-huset'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/view/house/A-huset

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/view/house/A-huset
fi
echo
echo

echo "Testing route 'localhost:1337/room/view/house/A-huset?max=2'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/view/house/A-huset?max=2

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/view/house/A-huset?max=2
fi
echo
echo

echo "Testing route 'localhost:1337/room/view/house/A-huset?max=4'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/view/house/A-huset?max=4

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/view/house/A-huset?max=4
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/Karlshamn'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/Karlshamn

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/Karlshamn
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/Karlshamn?max=2'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/Karlshamn?max=2

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/Karlshamn?max=2
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/a'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/a

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/a
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/2-'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/2-

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/2-
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/2-?max=2'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/2-?max=2

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/2-?max=2
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/G2'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/G2

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/G2
fi
echo
echo

echo "Testing route 'localhost:1337/room/search/empty'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/search/empty

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/search/empty
fi
echo
echo

echo "Testing route 'localhost:1337/room/view/house/Karlskrona'..."
echo "Response code:"
curl -s -o /dev/null -I -X GET -w "%{http_code}" localhost:1337/room/view/house/Karlskrona

if [[ verbose -eq 1 ]]; then
  echo
  echo
  echo "Response:"
  curl -s localhost:1337/room/view/house/Karlskrona
fi
echo
echo