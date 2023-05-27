import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ClientQueryDto } from 'src/common/shared/dtos/client-query.dto'
import { ACCESS_TOKEN_KEY } from 'src/common/utils/constants/app.constant'
import { Order } from '../schemas/order.schema'
import { OrdersService } from '../services/orders.service'

@ApiTags('/my-orders')
@Controller('my-orders')
export class MyOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async fetchMyOrders(@Req() req, @Query() query: ClientQueryDto): Promise<Partial<Order>[]> {
    return this.ordersService.getMyOrders(req.user._id, query)
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async countMyOrders(@Req() req): Promise<number> {
    return this.ordersService.countMyOrders(req.user._id)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async fetchMyOrderDetail(@Req() req, @Param('id') id: string): Promise<Partial<Order>> {
    const result = await this.ordersService.getMyOrderDetail(id)
    const isBelongToUser = result.history.createdBy._id.toString() === req.user._id

    if (!isBelongToUser) {
      throw new NotFoundException('Order is not found')
    }
    return result
  }
}
