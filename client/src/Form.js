import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {

    state= {
        text: ' '
    }

    handleOnChange = (e) => {
        const newText = e.target.value;
        this.setState ({
            text: newText
        });
    }

    handleKeyDown = e => {
        if(e.key === "Enter") {
            this.props.submit(this.state.text);
            this.setState({
                text: " "
            });
        }
    };

    render(){
        const {text} = this.state;
        return (
            <TextField
                label="Todo..." 
                margin="normal" 
                fullWidth
                value = {text}
                onChange = {this.handleOnChange}
                onKeyDown = {this.handleKeyDown}
            />
        );
    }
}