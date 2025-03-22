// payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { UpdatePaymentDto } from '../dto/updatePayment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    await this.paymentRepository.update(id, updatePaymentDto);
    const updatedPayment = await this.paymentRepository.findOne({ where: { id } });
    if (!updatedPayment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return updatedPayment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
  }
}
