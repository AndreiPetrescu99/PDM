/*
    File upload
 */
const fs = require('fs');
const path = require('path');
// const dateFormat = require('../utils/dateFormat.js')
const upload= {
    UPLOAD: '/upload',
    IMAGE: '/image/',
    FILE: '/file/',
    MAXFILESIZE: 200 * 1024 * 1024, //Upload file size
}
// Create a file directory
const mkdirFile = (path) => {
    let pathList = path.split('/');
    let fileDir = ''
    pathList.forEach(i => {
        if(i) {
            fileDir += ('/' + i)
            if(!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, err => {
                    LogFile.info('Create failure', err)
                    return
                });
            }
        }
    })
}
//Save file
const saveFile = (file, path) => {
    return new Promise((resolve, reject) => {
        let render = fs.createReadStream(file);
        // Create a write stream
        let upStream = fs.createWriteStream(path);
        render.pipe(upStream);
        upStream.on('finish', () => {
            resolve(path)
        });
        upStream.on('error', (err) => {
            reject(err)
        });
    })
}

/**
 * File upload
 * ps Generate file name SKD_date
 *     File paths are stored according to year and month
 */
const uploadImg = async ctx => {
    console.log(ctx);
    var time = Date.parse(new Date())
    //let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss');
    let file = ctx.request.files.file;
    let fileName = 'SKD_ '+ upload.UPLOAD + upload.IMAGE //Upload and save directory
    //let fileYear = date.substring(4, 8) + '/' +
        //date.substring(8, 10);
    let tail = file.name == 'blob' ? 'png' : file.name.split('.').pop()
    let filePath = path.join(fileName + '.' + tail); //Stitching file names according to time
    await mkdirFile(fileName + fileYear)         //Create a file directory
    await saveFile(file.path, filePath).then(su => {
        let uplaod_img = su.substring(upload.UPLOAD.length, su.length)
        ctx.body = {
            error_code: 10000,
            error_message: 'Successful upload of files',
            realName: uplaod_img,
        }
    }).catch(err => {
        ctx.body = {
            error_code: 20008,
            error_message: 'Failed to upload file!',
        }
    })
}

module.exports = {
    uploadImg
};