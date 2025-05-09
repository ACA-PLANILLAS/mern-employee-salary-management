import Parameter from "../models/ParameterModel.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const parameterError = require("../errors/ParameterError.json");

const { PARAMETER } = parameterError;

export const getAllParameter = async (req, res) => {
    try {
        const response = await Parameter.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: PARAMETER.SERVER_ERROR.code });
    }
}

export const getParameterById = async (req, res) => {
    try {
        const response = await Parameter.findOne({
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: PARAMETER.NOT_FOUND_BY_ID.code });
        }
    } catch (error) {
        res.status(500).json({ msg: PARAMETER.SERVER_ERROR.code });
    }
}

export const getParameterByType = async (req, res) => {
    try {
        const response = await Parameter.findAll({
            where: {
                type: req.params.type
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: PARAMETER.PARAMETER_NOT_FOUND.code });
        }
    } catch (error) {
        res.status(500).json({ msg: PARAMETER.SERVER_ERROR.code });
    }
}

export const updateParameter = async (req, res) => {
    try {
        const { id, name, value } = req.body;
        const response = await Parameter.update(
            { name, value },
            {
                where: {
                    id
                }
            }
        );
        if (response[0] === 1) {
            res.status(200).json({ msg: PARAMETER.SUCCESS.code });
        } else {
            res.status(404).json({ msg: PARAMETER.PARAMETER_NOT_FOUND.code });
        }
    }
    catch (error) {
        res.status(500).json({ msg: PARAMETER.SERVER_ERROR.code });
    }
}