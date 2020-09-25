import React,{createContext,useReducer} from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

//Initial state
const initialState = {
    transactions: [],
    error:null,
    loading:true,
}

//Create context
export const GlobalContext = createContext(initialState);

//Provider Component, wraps all the components
export const GlobalProvider = ({children}) =>{
    const [state,dispatch] = useReducer(AppReducer,initialState);
    //reducer - a way to change your state, and sends it down to app/component

    //Get all Transaction
    async function getTransactions(){
        try {
            const res = await axios.get('/api/v1/transactions');
            
            dispatch({
                type:'GET_TRANSACTIONS',
                payload:res.data.data
            });
        } catch (err) {
            dispatch({
                type:"TRANSACTION_ERROR",
                payload:err.response.data.error,
            });
        }
    }

    //Delete transaction
    async function deleteTransaction(id){
        try {
            await axios.delete(`/api/v1/transactions/${id}`);
            dispatch({
                type:'DELETE_TRANSACTION',
                payload:id,
            })
        } catch (err) {
            dispatch({
                type:"TRANSACTION_ERROR",
                payload:err.response.data.error,
            });
        }

        
    }

    //add transaction
    async function addTransaction(transaction){
        const config ={
            headers:{
                'Content-Type':'application/json'
            }
        };

        try {
            const res = await axios.post('/api/v1/transactions',transaction,config);
            dispatch({
                type:'ADD_TRANSACTION',
                payload:res.data.data,
            });
        } catch (err) {
            dispatch({
                type:"TRANSACTION_ERROR",
                payload:err.response.data.error,
            });
        }
        
    }

    //provide enclosed at globalcontext level, can be accessed by all the child components.
    return (<GlobalContext.Provider value={{
        transactions:state.transactions,
        error:state.error,
        loading:state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
        
    }}>
        {children}
    </GlobalContext.Provider>);
}