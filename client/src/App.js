import React, {Component } from 'react';
import './App.css';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/circularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop : theme.spacing.unit *3,
    overflowX: "auto"
  },

    table: {
    minWidth: 1080

  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    marginLeft:18,
    marginRight: 18
  },
  progress: {
   margin: theme.spacing.unit * 2 
  },
  grow: {
    flexGrow:1,
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
 
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
});


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
    customers: "",
    completed: 0,
    searchKeyword: ''
  }
}

  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0,
      serchKeyword: ''
    });

    this.callApi()
    .then(res => this.setState({customers: res}))
    .catch(err => console.log(err));
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20 );
    this.callApi()
    .then(res => this.setState({customers: res}))
    .catch(err => console.log(err));
  }

  callApi = async () => {
    console.log("body")
    const response = await fetch('http://localhost:5000/api/customers');
    const body = await response.json();
    
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1});

  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.name.indexOf(this.state.serchKeyword) > -1;
      });
      return data.map((c) => {
        return <Customer
        stateRefresh={this.stateRefresh}
        key={c.id}
        id={c.id}
        image={c.image}
        number={c.number}
        name={c.name}
        price={c.price}
        count={c.count}
        />
      });
    }
    const { classes } = this.props;
    const cellList = ["품번", "상품이미지", "품명", "가격", "수량", "입고", "출고"];
    return (
      <div className={classes.root}>
       <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            고객 관리 시스템
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              name="serchKeyword"
              value={this.state.serchKeyword}
              onChange={this.handleValueChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.menu}>
      <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
      <Paper>
        <Table classNmae={classes.table}>
          <TableHead>
            <TableRow>
              {cellList.map(c => {
                return <TableCell className={classes.tableHead}>{c}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.customers ? 
            filteredComponents(this.state.customers) : 
            <TableRow>
            <TableCell colSpan="6" align="center">
              <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
            </TableCell>
          </TableRow>
            }
          </TableBody>
        </Table>
       </Paper>
       </div>
    );
  }

}

export default withStyles(styles)(App);