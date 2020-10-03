import { Module, DynamicModule, Provider } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthenticationToolsModuleAsyncOptions, AuthenticationToolsModuleOptions } from './interfaces/authentication-tools-options.interface';
import { AUTHENTICATION_TOOLS_MODULE_OPTIONS, AUTHENTICATION_TOOLS_MODULE_ID } from './authentication-tools.constants';
import { GraphQLAuthenticationGuard } from './guards/graphql-authentication.guard';

@Module({
    providers: [
        GraphQLAuthenticationGuard,
    ],
    exports: [
        GraphQLAuthenticationGuard,
    ]
})
export class AuthenticationToolsModule {

    private static get defaultOptions() {
        return {
            userIdField: 'sub',
        }
    }

    public static forRoot(options: AuthenticationToolsModuleOptions): DynamicModule {
        return {
            module: AuthenticationToolsModule,
            global: options.isGlobal,
            providers: [
                {
                    provide: AUTHENTICATION_TOOLS_MODULE_OPTIONS,
                    useValue: {
                        ...this.defaultOptions,
                        ...options,
                    },
                },
            ],
        }
    }

    public static forRootAsync(options: AuthenticationToolsModuleAsyncOptions): DynamicModule {
        return {
            module: AuthenticationToolsModule,
            global: options.isGlobal,
            imports: options.imports,
            providers: [
                this.createAsyncOptionsProvider(options),
                {
                    provide: AUTHENTICATION_TOOLS_MODULE_ID,
                    useValue: uuid.v4(),
                }
            ],
            exports: [
                this.createAsyncOptionsProvider(options)
            ]
        }
    }

    private static createAsyncOptionsProvider(
        options: AuthenticationToolsModuleAsyncOptions,
    ): Provider {
        return {
            provide: AUTHENTICATION_TOOLS_MODULE_OPTIONS,
            useFactory: async (...args: any[]) => ({
                ...this.defaultOptions,
                ...(await options.useFactory(...args)),
            }),
            inject: options.inject || [],
        };

    }
}
