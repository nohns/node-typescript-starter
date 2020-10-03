import { ModuleMetadata } from "@nestjs/common/interfaces";

export interface AuthenticationToolsModuleOptions {
    jwtSecret: string;
    userIdField?: string;
    isGlobal?: boolean;
}

export interface AuthenticationToolsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<AuthenticationToolsModuleOptions> | AuthenticationToolsModuleOptions;
    inject?: any[];
    isGlobal?: boolean;
}