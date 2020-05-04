import React from 'react';
import {post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    hidden: {
        display: 'none'
    }
});

class CustomerAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            file: null,
            number: '',
            name: '',
            price: '',
            count: '',
            fileName:'',
            open: false

        }
    }

    handleFormSubmit = (e) => {
        e.preventdEFAULT()
        this.addCustomer()
            .then((response) => {
                console.log(response.data);
                this.props.stateRefresh();
            })
            this.setState({
                file: null,
                number: '',
                name: '',
                price: '',
                count: '',
                fileName:'',
                open: false
            })
            
    }


    handleFileChange = (e) =>{
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        })
    }

    handleValueChange = (e) =>{
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    addCustomer = () => {
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file)
        formData.append('number', this.state.number)
        formData.append('name', this.state.name)
        formData.append('price', this.state.price)
        formData.append('count', this.state.count)
        const config = {
            headers: {
                'content=type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);

    }

    handleClickOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose= () => {
        this.setState({
            file: null,
            number: '',
            name: '',
            price: '',
            count: '',
            fileName:'',
            open: false
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    고객 추가하기
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>고객 추가</DialogTitle>
                    <DialogContent>
                    <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
                    <label htmlFor ="raised-button-file">
                        <Button variant="contained" color="primary" component="span" name="file">
                            {this.state.fileName === "" ? "프로필 이미지 선택" : this.state.fileName}
                        
                        </Button>    
                    </label>
                    <br/>
                    <TextField label="품번" input type="text" name="number" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                    <TextField label="품명" input type="text" name="name" value={this.state.birthday} onChange={this.handleVlaueChange}/><br/>
                    <TextField label="가격" input type="text" name="price" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                    <TextField label="수량" input type="text" name="count" value={this.state.job} onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                        <Button variant="contained" color="primary" onClick={this.handleFormClose}>닫기</Button>
                        </DialogActions>
                </Dialog>
            </div>
          
            
        )
    }
}
export default withStyles(styles)(CustomerAdd);