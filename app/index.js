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
            ${chalk.dim('|')}    ${chalk.green('chanjet-gzq-h5')}  ${chalk.dim('生成项目')}                                      ${chalk.dim('|')}
            ${chalk.dim('|')}    ${chalk.green('chanjet-gzq-h5 create xx -c')}  ${chalk.dim('生成一个React Component')}          ${chalk.dim('|')} 
            ${chalk.dim('|')}    ${chalk.green('chanjet-gzq-h5 create xx -p')}  ${chalk.dim('生成一个Page页面')}                 ${chalk.dim('|')}
            ${chalk.dim('|')}    ${chalk.green('chanjet-gzq-h5 -h')}  ${chalk.dim('查看帮助说明')}                               ${chalk.dim('|')}
            ${chalk.dim('-------------------------------------------------------------')}
        `);
       this.dirname = '';
       var inputs = cli.input;
       var flags = cli.flags;
       var option = null;
        for(var key in flags){
            option = key;
            break;
        }

       var arg1 = inputs[0];

        if(arg1 === 'create' && inputs[1]){
            this.create = true;
            this.fileName = inputs[1];
            return [];
        }else if(flags.h){
            cli.showHelp();
        }else if(flags.v){
            console.log(chalk.green('v'+cli.pkg.version));
            process.exit(0);
        }else if(inputs.length===0  && option){
            console.log(chalk.red(cli.pkg.name+': 不支持参数：-'+option));
            process.exit(0);
        }else{
            this.dirname = inputs[0]
        }
        
        var prompts = [
         /*   {
                type: 'checkbox',
                name: 'suportMoudle',
                message: '选择需要支持的模块',
                choices: [
                    {name: `${chalk.green('chanjet-mutants')}   ${chalk.dim('提供native插件支持和环境检测')}`, value:'chanjet-mutants', checked: true, short: 'chanjet-mutants'},
                    {name: `${chalk.green('chanet-navigator')}  ${chalk.dim('提供页面路由管理')}`, checked: true, short: 'chanet-navigator' },
                    {name: `${chalk.green('chanjet-ui')}        ${chalk.dim('提供常用UI组件支持')}`, checked: true, short: 'chanjet-ui'}
                ],
                validate: function (answer) {
                    var answerStr = answer.join('');
                    var hasChecked = function(name){
                        return answerStr.indexOf(name) !== -1;
                    }
                    if(hasChecked('chanjet-ui')){
                        if(!hasChecked('chanet-navigator') && !hasChecked('chanjet-mutants')){
                            return chalk.yellow('chanjet-ui依赖于chanjet-mutants和chanjet-navigator, 请勾选两者');
                        }else if(!hasChecked('chanet-navigator')){
                            return 'chanjet-ui依赖于chanjet-navigator，请勾选';
                        }else if(!hasChecked('chanjet-mutants')){
                            return 'chanjet-ui依赖于chanjet-mutants， 请勾选';
                        }
                    }else if(hasChecked('chanet-navigator') && !hasChecked('chanet-mutants')){
                        return 'chanjet-navigator依赖于chanjet-mutants， 请勾选';
                    }

                    return true;
                }
            },*/
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
            console.log('install ...');
            this.spawnCommand(answers.cnpm,['install']);
        }

    }

}

module.exports = App;

