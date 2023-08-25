import axios from 'axios';
import { countOrganizationPath, organizationPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Organization } from '../types/organization';

export const countOrganization = async ():Promise<{count: number}> => {
    const response = await axios.get(countOrganizationPath())
    return response.data
}

export const getOrganizations = async (context?: GetServerSidePropsContext):Promise<Organization[] | null> => {
  const path = organizationPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}