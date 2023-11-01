import axios from "axios";
import { guidePath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";

export const getGuides = async (filters?: string, context?: GetServerSidePropsContext): Promise<any[]> => {
  const response = await axios.get(guidePath(filters), getHeaders(context))
  return response.data
}
