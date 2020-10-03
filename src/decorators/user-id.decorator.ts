import { createRequestBoundParamDecorator } from "@nohns/graphql";

export const UserId = createRequestBoundParamDecorator((req: any) => req.userId);