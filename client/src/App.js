import React, { Component } from 'react';
import './App.css';
import gql from "graphql-tag";
import {graphql, compose} from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Checkbox, ListItemText} from '@material-ui/core';
import  CloseIcon from '@material-ui/icons/Close';
import Form from './Form';

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql `
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql `
  mutation($id: ID!){
    removeTodo(id: $id)
  }
`;

const CreateTodoMutation = gql `
  mutation ($text: String!) {
    createTodo(text: $text ) {
      text
      id
      complete
    }
  }
`;

class App extends Component {

  //Update Todo
  updateTodo = async todo => {
    //Update todo
    await this.props.updateTodo( {
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        // Read the data from our cache for this query
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end
        data.todos = data.todos.map(
          x => x.id === todo.id 
          ? {
              ...todo,
              complete: !todo.complete
            }
            : x
        );
        //Write our data back to the cache
        store.writeQuery({query: TodosQuery, data})
      }
    })

  }
  // Remove Todo
  removeTodo = async todo => {
    //remove todo
    await this.props.removeTodo( {
      variables: {
        id: todo.id,
      },
      update: store => {
        // Read the data from our cache for this query
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end
        data.todos = data.todos.filter(x => x.id !== todo.id);
        //Write our data back to the cache
        store.writeQuery({query: TodosQuery, data})
      }
    })
  }

  //Create Todo
  createTodo = async (text) => {
    //create todo
    await this.props.createTodo( {
      variables: {
        text,
      },
      update: (store, {data: {createTodo}}) => {
        // Read the data from our cache for this query
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end
        data.todos.unshift(createTodo);
        //Write our data back to the cache
        store.writeQuery({query: TodosQuery, data})
      }
    })
    
  }

  render() {
    const {data: {loading, todos}} = this.props;

    if(loading) {
      return null;
    }

    return (
      <div style= {{display: "flex"}}>
        <div style= {{margin: "auto", width: 400}}>
          <h1> Todo Application </h1>
          <p> with GraphQl Server and Apollo Client </p>
          <Paper el="1">
            <Form submit = {this.createTodo} />
            <List>
            {todos.map(todo => (
              <ListItem 
                key= {todo.id}
                role={undefined}
                dense
                button
                onClick = {() => this.updateTodo(todo)}
              >
                <Checkbox 
                  checked= {todo.complete}
                  tabIndex = {-1}
                  disableRipple
                />
                <ListItemText primary={todo.text} />
                <CloseIcon onClick= {()=> this.removeTodo(todo) }/>
              </ListItem>
            ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose( 
  graphql(CreateTodoMutation, {name: 'createTodo'}),
  graphql(RemoveMutation, {name: 'removeTodo'}),
  graphql(UpdateMutation, {name: 'updateTodo'}), 
  graphql(TodosQuery))(App); 
