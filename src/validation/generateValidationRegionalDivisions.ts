import * as Yup from "yup";
import {IntlShape} from "react-intl";

export const generateValidationDivisions = (intl: IntlShape) => {
    return Yup.object({
        type: Yup.number()
            .required(intl.formatMessage({id: 'required'}))
            .positive(intl.formatMessage({id: 'must_be_greater_than_0'}))
            .integer(intl.formatMessage({id: 'must_be_an_integer'})),
        area_code: Yup.string()
            .min(
                2,
                intl.formatMessage({id: "initialLength"}) +
                "2" +
                intl.formatMessage({id: "finalLength"})
            )
            .required(intl.formatMessage({id: "required"})),
        name: Yup.string()
            .min(
                2,
                intl.formatMessage({id: "initialLength"}) +
                "2" +
                intl.formatMessage({id: "finalLength"})
            )
            .required(intl.formatMessage({id: "required"}))
    });
};

export const generateValidationDivisionsModify = (intl: IntlShape, selectedType?: number) => {
    return Yup.object({
        type: Yup.number()
            .required(intl.formatMessage({id: 'required'}))
            .positive(intl.formatMessage({id: 'must_be_greater_than_0'}))
            .integer(intl.formatMessage({id: 'must_be_an_integer'})),
        area_code: Yup.string()
            .min(
                2,
                intl.formatMessage({id: "initialLength"}) +
                "2" +
                intl.formatMessage({id: "finalLength"})
            )
            .required(intl.formatMessage({id: "required"})),
        name: Yup.string()
            .min(
                2,
                intl.formatMessage({id: "initialLength"}) +
                "2" +
                intl.formatMessage({id: "finalLength"})
            )
            .required(intl.formatMessage({id: "required"})),
        contain_country: Yup.string()
            .min(
                2,
                intl.formatMessage({id: "initialLength"}) +
                "2" +
                intl.formatMessage({id: "finalLength"})
            )
            .required(intl.formatMessage({id: "required"})),
    });
};
