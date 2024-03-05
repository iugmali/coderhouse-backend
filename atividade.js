#! /usr/bin/node

const fs = require('fs');

fs.writeFileSync('./datetime.txt', (new Date().toString()));

if(fs.existsSync('datetime.txt')) {
  let content = fs.readFileSync('datetime.txt', 'utf-8');
  console.log(content)
}
