# public-tweet-statistics
Samples public tweets in real-time, while calculating some simple statistics

## Installation and Transpilation
1. git clone git@github.com:eppineda/public-tweet-statistics.git
2. npm install
3. tsc
4. cd dist
5. node index.js --help

## Usage Examples
```
node index.js --help                    command line help
node index.js                           sample public tweets and accept default statistics calculations
node index.js -d                        add debug-level console logging
node index.js -t 30000                  run for 30 seconds 
node index.js --top-hashtags 25         top 25 hashtags
node index.js --top-emojis 5            top 5 emojis
```
