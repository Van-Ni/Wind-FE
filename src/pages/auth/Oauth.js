import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoginOauth } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
export default function Oauth() {
    const dispatch = useDispatch();
    const { id, token } = useParams();
    useEffect(() => {
        if (id && token) {
            console.log(id, token);
            dispatch(LoginOauth(id,token));
        }
    }, [id])
    return (
        <div>Oauth</div>
    )
}
