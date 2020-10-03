import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common"
import { Request } from 'express';
import { Observable } from "rxjs";
import { GqlExecutionContext } from '@nestjs/graphql';
import { AUTHENTICATION_TOOLS_MODULE_OPTIONS } from "../authentication-tools.constants";
import { AuthenticationToolsModuleOptions } from "../interfaces/authentication-tools-options.interface";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GraphQLAuthenticationGuard implements CanActivate {
    constructor(@Inject(AUTHENTICATION_TOOLS_MODULE_OPTIONS) private readonly options: AuthenticationToolsModuleOptions) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        // Get request
        const graphqlCtx = GqlExecutionContext.create(ctx);
        const request = graphqlCtx.getContext().req as Request;

        // Get access token
        const authorizationHeaderPieces = request.header('Authorization')?.split(" ");
        if (!authorizationHeaderPieces || authorizationHeaderPieces.length !== 2) {
            throw new UnauthorizedException('No access token given.');
        }
        const token = authorizationHeaderPieces[1];

        // Verify access token
        const payload: any = jwt.verify(token, this.options.jwtSecret);
        if (!payload) {
            throw new UnauthorizedException('Invalid access token.');
        }

        // Save payload data on user request
        graphqlCtx.getContext().req.accessToken = token;
        graphqlCtx.getContext().req.userId = payload[this.options.userIdField!];
        graphqlCtx.getContext().req.username = payload['username'];

        // User is now authenticated
        return true;
    }

}