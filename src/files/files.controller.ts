/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { File } from 'buffer';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The file have been founded.',
    type: File,
    //return type of the response the token will be generated with the user data
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @Get('product/:imageName')
  findProductImages(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @ApiResponse({
    status: 200,
    description: 'The files have been founded.',
    //return type of the response the token will be generated with the user data
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('product')
  @Auth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    })
  )
  @ApiBearerAuth()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('Make Sure the file is an image');
    }
    const secureUrl = ` ${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;
    return {
      secureUrl,
    };
  }
}
