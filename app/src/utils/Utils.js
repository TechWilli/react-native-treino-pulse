import React, { useEffect, useRef } from 'react'
import { PermissionsAndroid } from 'react-native'
import axios from 'axios'

export const makeRequest = (url, method = 'get', data = {}, headers = {}) => {
	return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        })
		.then((response) => {
			resolve(response.data);
		})
		.catch(async error => {
			console.log("axios error", error)
			reject(error);
		});
    })
}

export const useEffectAfterDidMount = (fn, inputs) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current)
            fn();
        else
            didMountRef.current = true;
    }, [inputs]);
}

export const requestStoragePermission = async () => {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			{
				title: 'Permission',
				message:'This app needs this permission',
				buttonNeutral: 'Ask Me Later',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('permission granted');
		} else {
			console.log('permission denied');
		}
	} catch (err) {
		console.log("permission error:", err);
	}
}