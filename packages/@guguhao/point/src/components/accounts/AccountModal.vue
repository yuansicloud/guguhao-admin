<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';
import type { FormInstance } from 'ant-design-vue';

import type {
  AccountDto,
  ChangeAccountBalanceInput,
} from '../../types/accounts';
import type { TransactionDto } from '../../types/transactions';

import { defineOptions, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { formatToDateTime } from '@abp/core';
import {
  Button,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Tabs,
} from 'ant-design-vue';

import { changeBalanceApi, getByUserIdApi } from '../../api/accounts';
import { getPagedListApi } from '../../api/transactions';

defineOptions({
  name: 'AccountModal',
});

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const ListItem = List.Item;
const defaultModel = {} as AccountDto;

const transactionList = ref<Array<TransactionDto>>([]);
const activedTab = ref('info');
const form = ref<FormInstance>();
/** 表单数据 */
const formModel = ref<AccountDto>({ ...defaultModel });

const changeBalanceForm = ref<ChangeAccountBalanceInput>({
  changedBalance: 0,
  description: '系统调整',
});

const { hasAccessByCodes } = useAccess();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onClosed() {},
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      activedTab.value = 'info';
      formModel.value = { ...defaultModel };
      const userDto = modalApi.getData<IdentityUserDto>();
      modalApi.setState({
        loading: true,
        title: `${userDto.name} - ${userDto.phoneNumber}`,
      });
      try {
        if (userDto?.id) {
          formModel.value = await getByUserIdApi(userDto.id);
          await initTransactions(userDto.id);
        }
      } finally {
        modalApi.setState({
          loading: false,
        });
      }
    }
  },
  showConfirmButton: false,
  title: $t('AbpIdentity.Users'),
});

/** 检查管理角色权限 */
function checkManageRolePolicy() {
  return hasAccessByCodes(['PointService.Account.Manage']);
}

const initTransactions = async (userId: string) => {
  const res = await getPagedListApi({ accountUserId: userId });
  transactionList.value = res.items;
};

const handleChangeBalance = async () => {
  try {
    const userDto = modalApi.getData<IdentityUserDto>();
    if (formModel.value.id) {
      await changeBalanceApi(formModel.value.id, changeBalanceForm.value);
      message.success($t('point.balanceChangedSuccessfully'));
      // Refresh account data
      const account = await getByUserIdApi(userDto.id);
      formModel.value = account;
      // Refresh transactions
      await initTransactions(userDto.id);
      // Reset form
      changeBalanceForm.value = {
        changedBalance: 0,
        description: '系统调整',
      };
    }
  } catch (error) {
    console.error('Balance change failed:', error);
    message.error($t('point.balanceChangeFailed'));
  }
};
</script>

<template>
  <Modal>
    <Form
      ref="form"
      :label-col="{ span: 6 }"
      :model="formModel"
      :wrapper-col="{ span: 18 }"
    >
      <Tabs v-model:active-key="activedTab">
        <!-- 基本信息 -->
        <TabPane key="info" :tab="$t('AbpIdentity.UserInformations')">
          <FormItem :label="$t('point.balance')" name="balance">
            <Input v-model:value="formModel.balance" disabled />
          </FormItem>
          <FormItem :label="$t('point.lockedBalance')" name="lockedBalance">
            <Input v-model:value="formModel.lockedBalance" disabled />
          </FormItem>
          <FormItem :label="$t('point.totalUsed')" name="totalUsed">
            <Input v-model:value="formModel.totalUsed" disabled />
          </FormItem>
          <FormItem :label="$t('point.membershipName')" name="membershipName">
            <Input v-model:value="formModel.membershipName" disabled />
          </FormItem>
          <FormItem
            v-if="formModel.lastModificationTime"
            :label="$t('point.lastModificationTime')"
            name="lastModificationTime"
          >
            <Input
              :value="formatToDateTime(formModel.lastModificationTime)"
              disabled
            />
          </FormItem>
        </TabPane>
        <!-- 角色 -->

        <TabPane
          v-if="checkManageRolePolicy()"
          key="role"
          :tab="$t('point.recentTransaction')"
        >
          <List item-layout="horizontal" :data-source="transactionList">
            <template #renderItem="{ item }">
              <ListItem>
                <div class="flex w-full items-center justify-between">
                  <div class="flex w-1/2 justify-between">
                    <div v-if="item.changedBalance > 0" style="color: red">
                      +{{ item.changedBalance }}
                    </div>
                    <div v-else style="color: green">
                      {{ item.changedBalance }}
                    </div>
                    <div>
                      {{ item.description }}
                    </div>
                  </div>
                  <div>{{ formatToDateTime(item.creationTime) }}</div>
                </div>
              </ListItem>
            </template>
          </List>
        </TabPane>

        <TabPane
          v-if="checkManageRolePolicy()"
          key="changeBalance"
          :tab="$t('point.adjustBalance')"
        >
          <Form
            :model="changeBalanceForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <FormItem
              :label="$t('point.changeAmount')"
              name="changedBalance"
              :rules="[{ required: true }]"
            >
              <InputNumber
                v-model:value="changeBalanceForm.changedBalance"
                style="width: 100%"
                :min="-100000"
                :max="100000"
              />
            </FormItem>

            <FormItem
              :label="$t('point.description')"
              name="description"
              :rules="[{ required: true }]"
            >
              <Input
                v-model:value="changeBalanceForm.description"
                :placeholder="$t('point.description')"
              />
            </FormItem>

            <div class="flex w-full items-center justify-center">
              <Button type="primary" @click="handleChangeBalance">
                {{ $t('point.changeBalance') }}
              </Button>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </Form>
  </Modal>
</template>

<style lang="scss" scoped></style>
