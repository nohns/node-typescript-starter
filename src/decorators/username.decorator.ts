import { createRequestBoundParamDecorator } from "@nohns/graphql";

export const Username = createRequestBoundParamDecorator((req: any) => req.username);