/**
 * Created by guopeng on 16/4/16.
 */
'use strict';
var chalk = require('chalk');
var meow = require('meow');
var path = require('path');
var Yao = require('yao-cli');

var baseRoot = path.join(__dirname,'../');

class App extends Yao{

    constructor(){
        super(baseRoot);
    }

    prompting() {
       var cli = this.cli = meow(`
            ${chalk.yellow.bold('help:')}
            ${chalk.dim('-------------------------------------------------------------')}
            ${chalk.dim('|')}    ${chalk.green('chanapp')}  ${chalk.dim('生成项目')}                                      ${chalk.dim('|')}
            ${chalk.dim('|')}    ${chalk.green('chanapp create xx -c')}  ${chalk.dim('生成一个React Component')}          ${chalk.dim('|')} 
            ${chalk.dim('|')}    ${chalk.green('chanapp create xx -p')}  ${chalk.dim('生成一个Page页面')}                 ${chalk.dim('|')}
            ${chalk.dim('|')}    ${chalk.green('chanapp -h')}  ${chalk.dim('查看帮助说明')}                               ${chalk.dim('|')}
            ${chalk.dim('-------------------------------------------------------------')}
        `);
       this.dirname = '';
       var inputs = cli.input;
       var flags = cli.flags;

       var arg1 = inputs[0];

        if(arg1 === 'create' && inputs[1]){
            this.create = true;
            this.fileName = inputs[1];
            return [];
        }else if(flags.h){
            cli.showHelp();
            return [];
        }else{
            this.dirname = inputs[0]
        }
        
        var prompts = [
            {
                type: 'list',
                name: 'cnpm',
                message: '选取自动安装项目依赖?',
                default: false,
                choices: [
                    {name: '不安装', value: 'none', short: '不安装'},
                    {name: 'npm, 从npm官方安装', value: 'npm', short: '从npm.org安装'},
                    {name: 'cnpm, 从chanjet镜象安装', value: 'cnpm', short: '从chanjet镜象安装'}
                ]
            }
        ];
        if(!this.dirname){
            prompts.unshift({
                type: 'input',
                name: 'dirname',
                message: '请输入项目名称: '
            })
        }

        return prompts;

    }

    writing(){
        if(this.create){
            this.createTplFile(this.fileName,this.cli.flags);
        }else{
            if(!this.dirname){
                this.dirname = this.answers.dirname;
            }
            this.buildEnv();
            this.assetsDirs();

        }


    }

    buildEnv(){
        this.appName = this.dirname || this.answers.dirname;
        this.destinationRoot(this.appName);
    }

    assetsDirs(){
        this.fs.copy(
            this.templatePath('app'),
            this.destinationPath()
        );

        this.fs.copy(
            this.templatePath('app/.babelrc'),
            this.destinationPath('.babelrc')
        );

    }

    createTplFile(fileName, flags){
        // component (react)
        if(flags.c){
            this.fs.copyTpl(this.templatePath('tpl/Component.js'),path.join(process.cwd(),`${fileName}.js`),{className:fileName},{})
        }
        
        // page
        if(flags.p){
            this.fs.copyTpl(this.templatePath('tpl/Page.js'),path.join(process.cwd(),`${fileName}Page.js`),{className:`${fileName}Page`},{})
        }
    }

    install(){
        var answers = this.answers;
        if(answers.cnpm !== 'none'){
            this.spawnCommand(answers.cnpm,['install']);
        }

    }

}

module.exports = App;

