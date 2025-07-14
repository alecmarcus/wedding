import { RESPONSE_STATUS } from "./responseStatus"

export const serverRedirect = (
  location: string,
  {
    body,
    status,
    headers,
    ...response
  }: Omit<ResponseInit, "status"> & {
    status: keyof typeof RESPONSE_STATUS
    body?: BodyInit | null
  } = {
    status: "Found302",
  }
) => {
  return new Response(body || null, {
    status: RESPONSE_STATUS[status].code,
    headers: {
      // biome-ignore lint/style/useNamingConvention: vendor property is capitalized
      Location: location,
      ...headers,
    },
    ...response,
  })
}
