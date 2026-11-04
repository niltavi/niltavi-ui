// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Chip, Table} from "@heroui/react";

export function ColumnResizing() {
  const t = useCopy();
  return (
    <Table>
      <Table.ResizableContainer>
        <Table.Content aria-label={t("Table with resizable columns")} className="min-w-[700px]">
          <Table.Header>
            <Table.Column isRowHeader defaultWidth="1fr" id="name" minWidth={160}>
              {t("Name")}<Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth="1fr" id="role" minWidth={220}>
              {t("Role")}<Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth="1fr" id="status" minWidth={100}>
              {t("Status")}<Table.ColumnResizer />
            </Table.Column>
            <Table.Column defaultWidth="1fr" id="email" minWidth={200}>
              {t("Email")}</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t("Kate Moore")}</Table.Cell>
              <Table.Cell>{t("CEO")}</Table.Cell>
              <Table.Cell>
                <Chip color="success" size="sm" variant="soft">
                  {t("Active")}</Chip>
              </Table.Cell>
              <Table.Cell>{t("kate@acme.com")}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("John Smith")}</Table.Cell>
              <Table.Cell>{t("CTO")}</Table.Cell>
              <Table.Cell>
                <Chip color="success" size="sm" variant="soft">
                  {t("Active")}</Chip>
              </Table.Cell>
              <Table.Cell>{t("john@acme.com")}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("Sara Johnson")}</Table.Cell>
              <Table.Cell>{t("CMO")}</Table.Cell>
              <Table.Cell>
                <Chip color="warning" size="sm" variant="soft">
                  {t("On Leave")}</Chip>
              </Table.Cell>
              <Table.Cell>{t("sara@acme.com")}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("Michael Brown")}</Table.Cell>
              <Table.Cell>{t("CFO")}</Table.Cell>
              <Table.Cell>
                <Chip color="success" size="sm" variant="soft">
                  {t("Active")}</Chip>
              </Table.Cell>
              <Table.Cell>{t("michael@acme.com")}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("Emily Davis")}</Table.Cell>
              <Table.Cell>{t("Product Manager")}</Table.Cell>
              <Table.Cell>
                <Chip color="danger" size="sm" variant="soft">
                  {t("Inactive")}</Chip>
              </Table.Cell>
              <Table.Cell>{t("emily@acme.com")}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ResizableContainer>
    </Table>
  );
}

export default ColumnResizing;
