import axios from 'axios';
import {
    GET_DATA_GAJI_SUCCESS,
    GET_DATA_GAJI_FAILURE,
    DELETE_DATA_GAJI_SUCCESS,
    DELETE_DATA_GAJI_FAILURE
} from './dataGajiActionTypes';

import { API_URL } from "@/config/env";

export const getDataGaji = (year, month) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
        `${API_URL}/data_gaji_pegawai?year=${year}&month=${month}`
      );
            dispatch({
                type: GET_DATA_GAJI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_GAJI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataGaji = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/data_gaji_pegawai/id/${id}`);
            dispatch({
                type: DELETE_DATA_GAJI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_GAJI_FAILURE,
                payload: error.message
            });
        }
    };
};