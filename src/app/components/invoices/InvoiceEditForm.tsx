import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isEmpty, isEqual } from 'lodash';
import { nanoid } from 'nanoid';
import {
  Box,
  Group,
  Paper,
  SimpleGrid,
  Grid,
  Col,
  Input,
  Title,
  Text,
  Select,
  NativeSelect,
  ActionIcon,
  Textarea,
  Divider,
} from '@mantine/core';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { Client, CreateInvoice, Invoice, InvoiceItem } from '@/core/types';
import { useClients } from '@/app/api/clients';
import { createInvoiceState, createInvoiceItem } from '@/app/store';
import { formatCurrency, getInvoiceSubtotal, getInvoiceTotal } from '@/app/utils';
import { DatePicker } from '@mantine/dates';
import Button from '@/app/components/shared/Button';
import TextField from '@/app/components/shared/TextField';
import ClientPicker from '@/app/components/clients/ClientPicker';
import Link from '@/app/components/shared/Link';
import { useInvoice } from '@/app/api/invoices';

interface Props {
  invoice: Invoice | CreateInvoice;
}

export default function InvoiceEditForm({ invoice }: Props) {
  const setInvoice = useSetRecoilState(createInvoiceState);
  const [client, setClient] = useState<Client>({});
  const { data: clients } = useClients();
  const { data: invoiceData } = useInvoice(invoice?._id);

  const handleChange = (e: React.ChangeEvent<{ value: string; name: string }>) => {
    const { name, value } = e.target;
    setInvoice((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetClient = () => {
    setClient({});
    setInvoice((prevState) => ({
      ...prevState,
      toName: '',
      toEmail: '',
      toCompany: '',
      toAddress: '',
      client: {},
    }));
  };

  const handleClientChange = (client: Client) => {
    if (client) {
      setClient(client);
      setInvoice((prevState) => ({
        ...prevState,
        toName: client.fullName,
        toEmail: client.email,
        toCompany: client.company,
        toAddress: client.address,
        client,
      }));
    }
  };

  const handleIssuedDateChange = (dateValue: Date) => {
    setInvoice((prevState) => ({
      ...prevState,
      issuedOn: dateValue?.toISOString() || '',
    }));
  };

  const handleDueDateChange = (dateValue: Date) => {
    setInvoice((prevState) => ({
      ...prevState,
      dueOn: dateValue?.toISOString() || '',
    }));
  };

  const createItem = () => {
    const itemId = (() => nanoid())();
    return createInvoiceItem(itemId);
  };

  const handleAddItem = () => {
    const newItem = createItem();
    setInvoice((prevState) => ({ ...prevState, items: [...prevState.items, newItem] }));
  };

  const handleDeleteItem = (itemId: string) => {
    if (invoice?.items.length === 1) {
      const items = [createItem()];
      setInvoice((prevState) => ({ ...prevState, items }));
    } else {
      const updatedInvoiceItems = invoice?.items.filter((item) => item._id !== itemId);
      setInvoice((prevState) => ({ ...prevState, items: updatedInvoiceItems }));
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.currentTarget;
    const itemId = id.split('--')[0];
    const updatedInvoiceItems = invoice?.items.map((item) => {
      if (item._id === itemId) {
        return { ...item, subtotal: getItemSubtotal(item), [name]: value };
      }
      return item;
    });
    setInvoice((prevState) => ({
      ...prevState,
      items: updatedInvoiceItems.map((item) => ({ ...item, subtotal: getItemSubtotal(item) })),
    }));
  };

  const handleSelectItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const itemId = name.split('--')[0];
    const itemName = name.split('--')[1];
    const updatedInvoiceItems = invoice?.items.map((item) => {
      if (item._id === itemId) {
        return { ...item, [itemName]: value };
      }
      return item;
    });
    setInvoice((prevState) => ({
      ...prevState,
      items: updatedInvoiceItems.map((item) => ({ ...item, subtotal: getItemSubtotal(item) })),
    }));
  };

  const getItemSubtotal = (item: InvoiceItem) => {
    return Number(item.units) * Number(item.rate);
  };

  return (
    <Box>
      <Group direction="column" spacing="sm" grow>
        <SimpleGrid cols={3}>
          <Paper padding="md" shadow="xs" withBorder>
            <Group direction="column" spacing="sm" grow>
              <Title order={2}>Invoice details</Title>
              <TextField
                label="Invoice #"
                name="invoiceNumber"
                onChange={handleChange}
                value={invoice?.invoiceNumber}
                type="number"
                placeholder="123456"
              />
              <DatePicker
                placeholder="Pick date"
                label="Issued date"
                clearable={false}
                value={new Date(invoice?.issuedOn)}
                onChange={handleIssuedDateChange}
              />
              <DatePicker
                placeholder="Pick date"
                label="Due date"
                clearable={false}
                value={new Date(invoice?.dueOn)}
                onChange={handleDueDateChange}
              />
            </Group>
          </Paper>
          <Paper padding="md" shadow="xs" withBorder>
            <Group direction="column" spacing="sm" grow>
              <Title order={2}>Bill from</Title>
              <TextField
                label="Name"
                name="fromName"
                value={invoice?.fromName}
                onChange={handleChange}
                placeholder="Enter your legal name"
              />
              <TextField
                label="Company name"
                name="fromCompany"
                value={invoice?.fromCompany}
                onChange={handleChange}
                placeholder="Enter your business name"
              />
              <TextField
                label="Address"
                name="fromAddress"
                value={invoice?.fromAddress}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </Group>
          </Paper>
          <Paper padding="md" shadow="xs" withBorder>
            <Group direction="column" spacing="sm" grow>
              <Title order={2}>Bill to</Title>
              {isEmpty(invoice?.toName) ? (
                <ClientPicker
                  label="Client"
                  clients={clients?.data || []}
                  setClient={handleClientChange}
                />
              ) : (
                <Box>
                  <Text size="sm" className="font-medium" mt={2}>
                    Client
                  </Text>
                  <Box mt={-2}>
                    <Text>{invoice?.toName}</Text>
                    <Box mt={-2}>
                      <Link size="sm" onClick={resetClient}>
                        Choose a different client
                      </Link>
                    </Box>
                  </Box>
                </Box>
              )}
              <TextField
                label="Company name"
                name="toCompany"
                value={invoice?.toCompany}
                onChange={handleChange}
                placeholder="Enter clients company name"
              />
              <TextField
                label="Address"
                name="toAddress"
                onChange={handleChange}
                value={invoice?.toAddress}
                placeholder="Enter clients address"
              />
            </Group>
          </Paper>
        </SimpleGrid>

        <Paper padding="md" shadow="xs" withBorder>
          <Title order={2}>Items</Title>
          <Grid mt={5}>
            <Col span={5}>
              <Text className="font-medium">Description</Text>
            </Col>
            <Col span={3}>
              <Text className="font-medium">Units/hrs</Text>
            </Col>
            <Col span={2}>
              <Text className="font-medium">Rate</Text>
            </Col>
            <Col span={1}>
              <Text className="font-medium">Subtotal</Text>
            </Col>
          </Grid>

          {invoice?.items.map((item) => (
            <Grid key={item?._id}>
              <Col span={5}>
                <Input
                  id={`${item._id}--description`}
                  name="description"
                  defaultValue={item.description}
                  onChange={handleItemChange}
                />
              </Col>
              <Col span={3}>
                <Group spacing="xs" grow>
                  <Input
                    type="number"
                    id={`${item._id}--units`}
                    name="units"
                    defaultValue={item.units}
                    onChange={handleItemChange}
                    min={0}
                  />
                  <NativeSelect
                    id={`${item._id}--unitsType`}
                    name={`${item._id}--unitsType`}
                    onChange={handleSelectItemChange}
                    value={item.unitsType}
                    data={[
                      { value: 'units', label: 'units' },
                      { value: 'hrs', label: 'hrs' },
                    ]}
                  />
                </Group>
              </Col>
              <Col span={2}>
                <Input
                  type="number"
                  id={`${item._id}--rate`}
                  name="rate"
                  defaultValue={item.rate}
                  onChange={handleItemChange}
                  min={0}
                />
              </Col>
              <Col span={1}>
                <Text className="flex justify-end items-center h-full w-full">{item.subtotal}</Text>
              </Col>
              <Col span={1}>
                <Box className="flex justify-end items-center h-full w-full">
                  <ActionIcon color="red" onClick={() => handleDeleteItem(item._id)}>
                    <FiTrash2 />
                  </ActionIcon>
                </Box>
              </Col>
            </Grid>
          ))}
          <Box mt={12}>
            <Button variant="default" leftIcon={<FiPlus />} onClick={handleAddItem}>
              Add item
            </Button>
          </Box>
        </Paper>

        <Grid>
          <Col span={8}>
            <Paper padding="md" shadow="xs" withBorder>
              <Title order={2}>Notes</Title>
              <Textarea
                className="mt-2"
                placeholder="Add additional information for the recipient..."
                rows={3}
                name="notes"
                value={invoice?.notes}
                onChange={handleChange}
              />
            </Paper>
          </Col>
          <Col span={4}>
            <Paper padding="md" shadow="xs" withBorder>
              <Group direction="column" grow>
                <Group position="apart" align="center">
                  <Text className="font-medium">Subtotal</Text>
                  <Text>{formatCurrency(getInvoiceSubtotal(invoice?.items))}</Text>
                </Group>
                <Group position="apart" align="center" grow>
                  <Input
                    placeholder="Tax"
                    name="taxLabel"
                    defaultValue={invoice?.taxLabel}
                    onChange={handleChange}
                  />
                  <Input
                    placeholder="0"
                    name="tax"
                    defaultValue={invoice?.tax}
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </Group>
                <Group position="apart" align="center" grow>
                  <Text className="font-medium">Discount</Text>
                  <Input
                    placeholder="0"
                    name="discount"
                    defaultValue={invoice?.discount}
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </Group>
                <Divider className="mt-1" />
                <Group position="apart" align="center">
                  <Text className="font-medium">Total</Text>
                  <Text>{formatCurrency(getInvoiceTotal(invoice) || 0)}</Text>
                </Group>
              </Group>
            </Paper>
          </Col>
        </Grid>
      </Group>
    </Box>
  );
}
