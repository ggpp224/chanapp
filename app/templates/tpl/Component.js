/**
 * created by chanapp-cli
 */
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';


function getStyle(props, context, state) {
    const {
        muiTheme: {
            baseTheme
        }
    } = context;


    const styles = {
        root: {

        },

        body: {

        }
    }

    return styles;

}

class <%= className %> extends Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    };

    state = {
    }

    componentWillReceiveProps(nextProps) {

    }

    render(){
        const {
            style,
        } = this.props;

        const {prepareStyles} = this.context.muiTheme;
        const styles = getStyle(this.props, this.context, this.state);

        return (
            <div style={prepareStyles(Object.assign(styles.root, style))}>

            </div>
        );
    }

    componentDidMount() {

    }


}

export default <%= className %>;