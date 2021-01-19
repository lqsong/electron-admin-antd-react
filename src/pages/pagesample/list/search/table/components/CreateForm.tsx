import React from 'react';
import { useIntl } from 'umi';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message } from 'antd';

import TypeSelect from './TypeSelect';

import { TableListItem } from '../data.d';

interface CreateFormProps {
  visible: boolean;
  values?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: Omit<TableListItem, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { visible, values, onSubmit, onSubmitLoading, onCancel } = props;
  const { formatMessage } = useIntl();

  const formVals: Omit<TableListItem, 'id'> = {
    name: values?.name || '',
    desc: values?.desc || '',
    href: values?.href || '',
    type: values?.type || '',
  };

  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const fieldsValue = await form.validateFields();
      onSubmit({ ...formVals, ...fieldsValue }, form);
    } catch (error) {
      message.warning(
        formatMessage({ id: 'app.global.form.validatefields.catch' }),
      );
    }
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="新增"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={() => onCancel()}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          loading={onSubmitLoading}
          onClick={() => onFinish()}
        >
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="createform"
        labelCol={{ span: 4 }}
        initialValues={{
          name: formVals.name,
          href: formVals.href,
          desc: formVals.desc,
          type: formVals.type,
        }}
      >
        <Form.Item
          label="位置"
          name="type"
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          <TypeSelect placeholder="请选择" />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入名称');
                } else if (value.length > 15) {
                  throw new Error('长度不能大于15个字');
                }
              },
            },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="网址"
          name="href"
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('请输入网址');
                } else if (
                  !/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
                    value,
                  )
                ) {
                  throw new Error('请输入正确的网址');
                }
              },
            },
          ]}
        >
          <Input placeholder="请输入网址" />
        </Form.Item>

        <Form.Item label="备注" name="desc">
          <Input placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
