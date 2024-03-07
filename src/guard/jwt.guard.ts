// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Request } from 'express';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtGuard implements CanActivate {
//   async canActivate(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest() as Request;
//     const user = await this.checkUser(request)
//     return true;
//   }

//   private async checkUser(request: Request) {
//     let token = request.header.auth;
//     if (!token) {
//       return false;
//     } else if (!token.includes("Bearer ")) {
//       return false;
//     } else {
//       token = token.replace("Bearer ", "");

//   }
// }
