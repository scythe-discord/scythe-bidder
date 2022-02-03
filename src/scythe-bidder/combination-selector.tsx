/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import {
  Faction,
  FactionMatCombinations,
  FMComboAction,
  FMComboActionType,
  Mat,
} from "./types";
import { Modal, Table, Checkbox, Button, Select, Tooltip } from "antd";
import { MATS_IFA, FACTIONS_IFA, PRESETS, BANNED_COMBOS } from "./constants";
import { getFactionIcon } from "./utils";
import cloneDeep from "lodash/cloneDeep";
import { isEqual } from "lodash";
import { WarningFilled } from "@ant-design/icons";

const { Column } = Table;

function getData(value: FactionMatCombinations) {
  return FACTIONS_IFA.map((faction) => {
    const result = MATS_IFA.reduce(
      (acc, curr) => {
        return { ...acc, [curr]: value[faction][curr] };
      },
      { imageUrl: getFactionIcon(faction), name: faction }
    );
    return result;
  });
}

function CombinationSelector({
  value,
  onToggle,
  onFactionToggle,
  onMatToggle,
  onPresetSelect,
}: {
  value: FactionMatCombinations;
  onToggle: (f: Faction, m: Mat, v: boolean) => void;
  onFactionToggle: (f: Faction, v: boolean) => void;
  onMatToggle: (m: Mat, v: boolean) => void;
  onPresetSelect: (value: FactionMatCombinations) => void;
}) {
  return (
    <div css={{ display: "flex", gap: 12 }}>
      <div css={{ flex: "0 0 540px" }}>
        <Table
          dataSource={getData(value)}
          pagination={false}
          css={{ ".ant-table-cell": { padding: 12 } }}
        >
          <Column
            dataIndex="imageUrl"
            render={(imageUrl, record: { name: Faction }) => {
              let allTrue = true;
              let allFalse = true;
              for (let v of Object.values(value[record.name])) {
                if (v) {
                  allFalse = false;
                } else {
                  allTrue = false;
                }
              }
              return (
                <div
                  css={{ display: "flex", alignItems: "center", gap: 8 }}
                  key={record.name}
                >
                  <Checkbox
                    checked={allTrue}
                    indeterminate={!allTrue && !allFalse}
                    onChange={(e) => {
                      onFactionToggle(record.name, e.target.checked);
                    }}
                  />
                  <img src={imageUrl} css={{ width: 24 }} alt={record.name} />
                </div>
              );
            }}
          />
          {MATS_IFA.map((matName) => {
            let allTrue = true;
            let allFalse = true;
            for (let v of Object.values(value)) {
              if (v[matName]) {
                allFalse = false;
              } else {
                allTrue = false;
              }
            }
            return (
              <Column
                dataIndex={matName}
                title={
                  <div css={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div>{matName.substring(0, 3)}.</div>
                    <Checkbox
                      checked={allTrue}
                      indeterminate={!allTrue && !allFalse}
                      onChange={(e) => {
                        onMatToggle(matName, e.target.checked);
                      }}
                    />
                  </div>
                }
                render={(v, record: { name: Faction }) => {
                  const isBanned = BANNED_COMBOS.some(
                    ({ faction, mat }) =>
                      faction === record.name && mat === matName
                  );
                  const content = (
                    <div
                      css={{
                        justifyContent: "flex-end",
                        color: "#fadb14",
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      {isBanned && <WarningFilled />}
                      <Checkbox
                        checked={v}
                        onChange={(e) => {
                          onToggle(record.name, matName, e.target.checked);
                        }}
                      />
                    </div>
                  );

                  return isBanned ? (
                    <Tooltip title="This combo is banned and not playable with others in Scythe Digital Edition.">
                      {content}
                    </Tooltip>
                  ) : (
                    content
                  );
                }}
              />
            );
          })}
        </Table>
      </div>
      <div>
        <div css={{ marginBottom: 8 }}>Presets</div>
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            type="link"
            onClick={() => {
              onPresetSelect(p.value);
            }}
            css={{ display: "block" }}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function reducer(
  state: FactionMatCombinations,
  action: FMComboAction
): FactionMatCombinations {
  let result = cloneDeep(state);
  switch (action.type) {
    case FMComboActionType.TOGGLE:
      result[action.faction][action.mat] = action.value;
      return result;
    case FMComboActionType.PRESET:
      return { ...action.preset };
    case FMComboActionType.FACTION_TOGGLE:
      MATS_IFA.forEach((mat) => {
        result[action.faction][mat] = action.value;
      });
      return result;
    case FMComboActionType.MAT_TOGGLE:
      FACTIONS_IFA.forEach((faction) => {
        result[faction][action.mat] = action.value;
      });
      return result;
  }
}

export default function CombinationSelectorFormItem({
  value,
  onChange,
}: {
  value: FactionMatCombinations;
  onChange: (value: FactionMatCombinations) => void;
}) {
  const [combinations, dispatch] = React.useReducer(reducer, value);
  const [visible, setVisible] = React.useState(false);
  return (
    <React.Fragment>
      <Modal
        visible={visible}
        width={768}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          onChange(combinations);
          setVisible(false);
        }}
      >
        <CombinationSelector
          value={combinations}
          onToggle={(f: Faction, m: Mat, v: boolean) => {
            dispatch({
              type: FMComboActionType.TOGGLE,
              faction: f,
              mat: m,
              value: v,
            });
          }}
          onFactionToggle={(f: Faction, v: boolean) => {
            dispatch({
              type: FMComboActionType.FACTION_TOGGLE,
              faction: f,
              value: v,
            });
          }}
          onMatToggle={(m: Mat, v: boolean) => {
            dispatch({
              type: FMComboActionType.MAT_TOGGLE,
              mat: m,
              value: v,
            });
          }}
          onPresetSelect={(v: FactionMatCombinations) => {
            dispatch({ type: FMComboActionType.PRESET, preset: v });
          }}
        />
      </Modal>
      <Select
        value={
          PRESETS.find(({ value: v }) => isEqual(v, value))?.label ?? "custom"
        }
        onChange={(v) => {
          const foundPreset = PRESETS.find(({ label }) => label === v);
          if (foundPreset) {
            onChange(foundPreset.value);
          }
        }}
        onSelect={(v) => {
          if (v === "custom") {
            setVisible(true);
          }
        }}
        css={{ width: "100px !important" }}
      >
        {PRESETS.filter(({ hide }) => !hide).map((preset) => (
          <Select.Option key={preset.label} value={preset.label}>
            {preset.label}
          </Select.Option>
        ))}
        <Select.Option value="custom">Custom</Select.Option>
      </Select>
    </React.Fragment>
  );
}
