import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {

    try {

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);  // Generate a salt with 10 rounds
      const hashedPassword = await bcrypt.hash(createUserDto.password.toString(), salt);

      // Set the encrypted password in the DTO
      const createUserDtoWithHashedPassword = {
        ...createUserDto,
        password: hashedPassword
      };

      const createdUser = new this.userModel(createUserDtoWithHashedPassword);

      await createdUser.save();

      return {
        message: 'User has been added successfully!',
        user: createdUser
      }
    }
    catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }



    // return `User has been added!`;
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {

    try {
      const updatedUser = this.userModel.updateOne({ _id: id }, updateUserDto).exec();
      return {
        message: 'User has been updated',
        user: updatedUser,
      }
    } catch (error) {
      throw new HttpException({ message: error.errmsg }, HttpStatus.BAD_REQUEST);
    }


  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  findByEmail(emailaddress: string) {
    return this.userModel.findOne({ email: emailaddress }).exec();
  }

  async getProfileImg(id: string): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    return user.profile_img;
  }

}
