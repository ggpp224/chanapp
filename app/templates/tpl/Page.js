import React  from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {connect} from 'mobx-reactor';
import Page from 'chanjet-ui/lib/Page';

@observer
class <%= className %> extends Page {

    constructor(props, context){
        super(props, context);
    }

    //页面标题
    title = '';

    //顶部导航栏配置
    navBar = {
        right: {
            type: 'button',
            item: {
                icon   : 'add',
                //onClick: this._onAddClick.bind(this)
            }
        }
    };

    state = {

    };

    renderContent() {

        return (
            <div>

            </div>
        );
    }

    componentDidMount(){

    }

    componentWillUnmount(){

    }


}

export default connect({

})(<%= className %>);
