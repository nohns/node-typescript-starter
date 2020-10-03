import { createRequestBoundParamDecorator } from "@nohns/graphql";

export const AccessToken = createRequestBoundParamDecorator((req: any) => req.accessToken);