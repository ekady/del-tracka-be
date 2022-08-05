import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResponseDto } from '../dto';

export const ApiResProperty = <TModel extends Type<any>>(
  model: TModel | TModel[],
  statusCode: number,
) => {
  const models = Array.isArray(model) ? model : [model];
  const data = Array.isArray(model)
    ? { type: 'array', items: { $ref: getSchemaPath(model[0]) } }
    : { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ResponseDto, ...models),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data,
              statusCode: {
                default: statusCode,
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({ description: 'Server error' }),
  );
};