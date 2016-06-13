/**
 * Created by Alexanderc on 5/24/2016.
 */

const t1 = require('nodejs-task1');
const fs = require('fs');
const EventEmitter = require('events');

module.export = {
    process: function (fileName) {
        const myEmitter = new EventEmitter();
        myEmitter.on('start', () => {
            console.log('a START event occurred!');
        });
        myEmitter.on('data', () => {
            console.log('a DATA event occurred!');
        });
        myEmitter.on('data-error', () => {
            console.log('a DATA-ERROR event occurred!');
        });
        myEmitter.on('error', () => {
            console.log('an ERROR event occurred!');
        });
        myEmitter.on('end', () => {
            console.log('an END event occurred!');
        });
        myEmitter.emit('start');
        let data = '';

        fs.createReadStream(fileName, 'utf8')
            .on("data", function (chunk) {
                data += chunk;
            })
            .on('end', function(){

                if(data.length > 0){
                    let dataArr = data.split(/\r?\n/);
                    console.log('dataArr.length: ' + dataArr.length);
                    for(var i=0; i<dataArr.length; i++){
                        console.log("current url: " + dataArr[i]);
                        if(t1.parse(dataArr[i])){
                            myEmitter.emit('data', dataArr[i]);
                        }else{
                            myEmitter.emit('data-error', dataArr[i]);
                        }
                    }

                }else{
                    myEmitter.emit('error');
                }
                myEmitter.emit('end');

            });
        return myEmitter;
    }
}
module.export.process("testFile.txt");
//module.export.parse("http://www.node.org:7077/docs/index.html?vasya=petya#myindex");
