import React, {ChangeEvent, useState} from "react";
import {Button} from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import {showMsg} from "../../../../helpers";
import {useRouter} from "next/router";
import {Formik, Form} from "formik";
import GenericInput from "../../common/GenericInput";
import {useIntl} from "react-intl";
import {Response} from "../../../../types";
import {RegionalDivisionForm, RegionalDivisionFormProps} from "../../../../types/regional_division";
import {createDivision, updateDivision} from "../../../../services/api.regional_division";
import {
    generateValidationDivisions,
    generateValidationDivisionsModify
} from "../../../../validation/generateValidationRegionalDivisions";

const DivisionsFormBody = ({regionalDivisionsTypes, id, regionalDivision, isFromDetails}: RegionalDivisionFormProps) => {
    const router = useRouter();
    const {locale} = router.query;
    const intl = useIntl();
    const [selectedType, setSelectedType] = useState<{ value: number; label: string }>();
    const [expanded, setExpanded] = React.useState(false)

    let initialValues: RegionalDivisionForm = {
        type: id && regionalDivision ? regionalDivision.type : 1,
        area_code: '',
        name: id && regionalDivision ? regionalDivision.name : '',
        company: undefined,
        contain_country: '',
        zip_start_with: '',
        num_ruler_pakage_follow: '',
    };

    const handleSubmit = async (values: RegionalDivisionForm) => {
        if (id) {
            await modify(id, values);
        } else {
            await create(values);
        }
    };

    const formatBody = (values: RegionalDivisionForm): RegionalDivisionForm => {
        let data: any = {};
        // data.type = values.type;
        // if (values.area_code != '')
        //     data.area_code = values.area_code;

        data.name = values.name;

        // if (values.company != 0)
        //     data.company = values.company;
        //
        // if (values.contain_country != '')
        //     data.contain_country = values.contain_country;
        //
        // if (values.zip_start_with != '')
        //     data.zip_start_with = values.zip_start_with;
        //
        // if (values.num_ruler_pakage_follow != '')
        //     data.num_ruler_pakage_follow = values.num_ruler_pakage_follow;

        return data;
    };

    const create = async (values: RegionalDivisionForm) => {
        const response: Response = await createDivision(formatBody(values));
        treatmentToResponse(response);
    };

    const modify = async (lineId: number, values: RegionalDivisionForm) => {
        const response: Response = await updateDivision(lineId, formatBody(values));
        treatmentToResponse(response);
    };

    const treatmentToResponse = (response: Response) => {
        if (response.status >= 200 && response.status <= 299) {
            const message = id
                ? intl.formatMessage({id: "changedsuccessfullyMsg"})
                : intl.formatMessage({id: "successfullyMsg"});
            showMsg(message, {type: "success"});
            router.push(`/${locale}/wms/regional_division`);
        } else {
            let message = intl.formatMessage({id: "unknownStatusErrorMsg"});
            showMsg(message, {type: "error"});
        }
    };

    const cancelSend = () => {
        router.push(`/${locale}/wms/regional_division`);
    };

    const goToEdit = () => {
        router.push(`/${locale}/wms/regional_division/${id}/update`);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        const {value} = event.target;
        setSelectedType(regionalDivisionsTypes.find(t=> t.value == value));
    }

    return (
        <div className="user-form-body shadow-small">
            <h1 className="text-xl font-semibold">
                {id
                    ? isFromDetails
                        ? intl.formatMessage({id: "vizualice"})
                        : intl.formatMessage({id: "modify"})
                    : intl.formatMessage({id: "insert"})}{" "}
                {intl.formatMessage({id: "regionalDivision"})}
            </h1>
            <div className="user-form-body__container">
                <Formik
                    initialValues={initialValues}
                    validationSchema={selectedType?.value == 2 ? generateValidationDivisionsModify(intl) : generateValidationDivisions(intl)}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting, isValid}) => (
                        <Form className="flex flex-col gap-3">
                            <div className="flex gap-3 flex-wrap justify-between">
                                <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                        type="select"
                                        name="type"
                                        selectLabel={intl.formatMessage({
                                            id: "type",
                                        })}
                                        options={regionalDivisionsTypes}
                                        customClass="custom-input"
                                        disabled={isFromDetails}
                                        onChangeFunction={handleInputChange}
                                        required
                                    />

                                </div>

                                <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                        type="text"
                                        name="area_code"
                                        placeholder={intl.formatMessage({id: "area_code"})}
                                        customClass="custom-input"
                                        disabled={isFromDetails}
                                        required
                                    />
                                </div>

                                <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                        type="text"
                                        name="name"
                                        placeholder={intl.formatMessage({id: "area_name"})}
                                        customClass="custom-input"
                                        disabled={isFromDetails}
                                        required
                                    />
                                </div>

                                <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                        type="text"
                                        name="company"
                                        placeholder={intl.formatMessage({id: "company"})}
                                        customClass="custom-input"
                                        disabled={true}
                                    />
                                </div>

                            </div>

                            {selectedType?.value == 2 && (
                                <div className="flex gap-3 flex-wrap justify-between">

                                    <div className="w-full sm:w-[100%]">
                                        <GenericInput
                                            type="textarea"
                                            name="contain_country"
                                            placeholder={intl.formatMessage({id: "contain_country"})}
                                            customClass="custom-input"
                                            disabled={isFromDetails}
                                            required={selectedType?.value == 2}
                                        />
                                    </div>

                                    <div className="w-full sm:w-[49%]">
                                        <GenericInput
                                            type="text"
                                            name="zip_start_with"
                                            placeholder={intl.formatMessage({id: "zip_start_with"})}
                                            customClass="custom-input"
                                            disabled={isFromDetails}
                                        />
                                    </div>

                                    <div className="w-full sm:w-[49%]">
                                        <GenericInput
                                            type="text"
                                            name="num_ruler_pakage_follow"
                                            placeholder={intl.formatMessage({id: "num_ruler_pakage_follow"})}
                                            customClass="custom-input"
                                            disabled={isFromDetails}
                                        />
                                    </div>

                                    <div className="w-full sm:w-[100%]">
                                        <ul>
                                            <li style={{fontSize: '14px'}}><b>{intl.formatMessage({id: "num_ruler_pakage_follow"})}</b></li>
                                            <li style={{marginTop: '5px'}}>{intl.formatMessage({id: "inc4"})}</li>
                                            <li>{intl.formatMessage({id: "inc5"})}</li>
                                            <li>{intl.formatMessage({id: "inc6"})}</li>
                                            <li>{intl.formatMessage({id: "inc7"})}</li>
                                            <li>{intl.formatMessage({id: "inc8"})}</li>
                                            <li>{intl.formatMessage({id: "zone_code"})}</li>
                                            <li>{intl.formatMessage({id: "y2"})}</li>
                                            <li>{intl.formatMessage({id: "y"})}</li>
                                            <li>{intl.formatMessage({id: "m"})}</li>
                                            <li>{intl.formatMessage({id: "d"})}</li>
                                        </ul>

                                    </div>

                                </div>
                            )}

                            <div className='flex justify-end gap-3' style={{paddingRight: '20px'}}>
                                <div>
                                    {
                                        !isFromDetails &&
                                        (
                                            <Button
                                                color="primary"
                                                type="submit"
                                                className='px-4'
                                                disabled={isSubmitting || !isValid}
                                            >
                                                {isSubmitting ? intl.formatMessage({id: 'sending'}) : (id ? intl.formatMessage({id: 'modify'}) : intl.formatMessage({id: 'add'}))}
                                            </Button>
                                        )
                                    }
                                    {
                                        isFromDetails && id && (
                                            <Button
                                                color="primary"
                                                type="button"
                                                className='px-4'
                                                onClick={() => goToEdit()}
                                            >
                                                {intl.formatMessage({id: 'go_to_edit'})}
                                            </Button>
                                        )
                                    }
                                </div>
                                <div>
                                    <Button
                                        type="button"
                                        className='bg-secundary px-4'
                                        onClick={() => cancelSend()}
                                    >
                                        {intl.formatMessage({id: 'cancel'})}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default DivisionsFormBody;
