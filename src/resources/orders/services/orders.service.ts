import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import dummy_orders from 'src/common/dummy_data/dummy_orders'
import { BaseModel, IEmbedOption } from 'src/common/shared/base-model'
import { ClientQueryDto } from 'src/common/shared/dtos/client-query.dto'
import Helper from 'src/common/utils/helpers/helper.helper'
import { Order, OrderDocument } from '../schemas/order.schema'

@Injectable()
export class OrdersService extends BaseModel<Order, OrderDocument> {
  get dummyData(): any[] {
    return dummy_orders
  }

  protected searchFields: string[] = ['_id', 'history.createdBy.email', 'history.createdBy.profile.fullName']

  protected basicEmbedOptions: IEmbedOption[] = [
    {
      path: 'history.createdBy',
      collection: 'users',
    },
  ]

  protected displayFields: string[] = ['_id', 'totalPrice', 'coursesInOrder', 'moneyConfiguration', 'history']

  constructor(@InjectModel(Order.name) protected orderModel: Model<OrderDocument>) {
    super('orders', orderModel)
  }

  async getOrderDetail(id: string) {
    const result = await this.model.findById(id).populate([
      {
        path: 'history.createdBy',
      },
      {
        path: 'coursesInOrder.course',
      },
    ])
    return result
  }

  async getMyOrders(userId: string, query: ClientQueryDto): Promise<Partial<Order>[]> {
    const standardQuery = this.cvtStandardizedQuery(query)
    const pipeline = [
      {
        $match: {
          'history.createdBy': Helper.cvtObjectId(userId),
        },
      },
      {
        $sort: {
          'history.createdAt': -1,
        },
      },
      {
        $project: {
          _id: 1,
          totalPrice: 1,
          history: 1,
        },
      },
      {
        $match: standardQuery.filter,
      },
      {
        $sort: standardQuery.sort,
      },
      {
        $skip: standardQuery.skip,
      },
      {
        $limit: standardQuery.limit,
      },
    ]

    const result = await this.model.aggregate(pipeline)
    return result
  }

  async countMyOrders(userId: string): Promise<number> {
    const pipeline = [
      {
        $match: {
          'history.createdBy': Helper.cvtObjectId(userId),
        },
      },
    ]

    const result = (await this.model.aggregate(pipeline)).length
    return result
  }

  async getMyOrderDetail(id: string): Promise<Partial<Order>> {
    const result = await this.model
      .findById(id)
      .select('_id totalPrice coursesInOrder history')
      .populate([
        {
          path: 'history.createdBy',
        },
        {
          path: 'coursesInOrder.course',
        },
      ])

    return result
  }
}
