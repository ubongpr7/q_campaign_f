"use client"
import { useState, useEffect } from "react";
import SetupAdAccountModal from "@/Components/Modals/SetupAdAccountModal";
import CampaignForm from "@/Components/Forms/CampaignForm";
import ConfigForm from "@/Components/Forms/ConfigForm";
import ProgressBar from "@/Components/ProgressBar/ProgressBar";
import SuccessScreen from "@/Components/SuccessScreen";

const mockCampaigns = [
  { id: "1", name: "Campaign 1", status: "ACTIVE", objective: "OUTCOME_SALES" },
  { id: "2", name: "Campaign 2", status: "PAUSED", objective: "OUTCOME_LEADS" },
];

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  return startTime.toISOString().slice(0, 16);
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  return endTime.toISOString().slice(0, 16);
};

const Main = ({ activeAccount, setActiveAccount }) => {
  const [formId, setFormId] = useState("mainForm");
  const [previousForm, setPreviousForm] = useState("mainForm");
  const [progress, setProgress] = useState(0);
  const [stepVisible, setStepVisible] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState("website");
  const [campaignType, setCampaignType] = useState("new");
  const [existingCampaigns, setExistingCampaigns] = useState(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(() => activeAccount ? !activeAccount.is_bound : false);

  useEffect(() => {
    setShowModal(prev => (activeAccount && !activeAccount.is_bound ? true : false));
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      resetForm();
    }
  }, [activeAccount]);

  const resetForm = () => {
    setFormId("mainForm");
    setCampaignType("new");
    setExistingCampaigns(mockCampaigns);
    setSelectedCampaign("");
  };

  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
    setSelectedCampaign("");
    setConfig((prevConfig) => ({
      ...prevConfig,
      objective: objective === "website" ? "OUTCOME_SALES" :
        objective === "lead" ? "OUTCOME_LEADS" :
          "OUTCOME_TRAFFIC",
    }));
  };

  const handleCampaignTypeSelect = (type) => {
    setCampaignType(type);
    if (type === "existing") {
      setExistingCampaigns(mockCampaigns);
    }
  };

  const handleCampaignSelect = (event) => {
    setSelectedCampaign(event.target.value);
    setDropdownOpen(false);
  };

  const [step, setStep] = useState("");
  const [config, setConfig] = useState({
    objective: "OUTCOME_SALES",
    campaign_budget_optimization: "AD_SET_BUDGET_OPTIMIZATION",
    budget_value: "50.73",
    campaign_bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    buying_type: "AUCTION",
    object_store_url: "",
    location: "GB",
    age_range_min: "30",
    age_range_max: "65",
    gender: "All",
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: "",
    ad_creative_headline: "",
    ad_creative_description: "",
    call_to_action: "SHOP_NOW",
    destination_url: "",
    url_parameters: "",
    ad_set_budget_value: "50.73",
    ad_format: "Single image or video",
    bid_amount: "5.0",
    end_time: getDefaultEndTime(),
    ad_set_bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    prediction_id: "",
    placement_type: "advantage_plus",
    platforms: {
      facebook: true,
      instagram: true,
      audience_network: true,
      messenger: true,
    },
    placements: {
      feeds: true,
      stories: true,
      in_stream: true,
      search: true,
      apps_sites: true,
      messages: true,
    },
  });

  const handleShowForm = (formId) => {
    if (!activeAccount || !activeAccount.is_bound) {
      toast.warning("Please connect an ad account to create campaigns.");
      return;
    }

    if (campaignType === "existing" && formId === "next" && !selectedCampaign) {
      toast.warning("Please select an existing campaign before proceeding.");
      return;
    }

    setPreviousForm(formId);
    setFormId(
      campaignType === "new" && formId === "next" ? "newCampaignForm" :
        campaignType === "existing" && formId === "next" ? "existingCampaignForm" :
          formId
    );
  };

  const handleEditConfig = () => {
    setPreviousForm(formId);
    setFormId("configForm");
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    setFormId(previousForm);
  };

  const handleCancelConfig = () => {
    setFormId(previousForm);
  };

  return (
    <>
      <link rel="stylesheet" href="/Styles/MainStyles.module.css" />

      <div className="container">
        {formId === "mainForm" && (
          <div className="formContainer">
            <h2 className="heading">Choose Campaign Objective</h2>
            <div className="objectiveContainer">
              {["website", "lead", "traffic"].map((objective) => (
                <div
                  key={objective}
                  className={`objective ${selectedObjective === objective ? "selected" : ""}`}
                  onClick={() => handleObjectiveSelect(objective)}
                >
                  <div className="icon">
                    <img
                      src="/assets/Device-Tablet-Search--Streamline-Tabler.png"
                      alt={`${objective} icon`}
                    />
                  </div>
                  <div className="content">
                    <h3>{objective.charAt(0).toUpperCase() + objective.slice(1)}</h3>
                    <p>Description for {objective} campaigns.</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="heading">Configure Your Campaign</h2>
            <div className="campaignTypeContainer">
              {["new", "existing"].map((type) => (
                <button
                  key={type}
                  className={`campaignTypeButton ${campaignType === type ? "selected" : ""}`}
                  onClick={() => handleCampaignTypeSelect(type)}
                >
                  <img
                    className="buttonIcon"
                    src={`/assets/${type}-icon.png`}
                    alt={`${type} campaign`}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)} Campaign
                </button>
              ))}
            </div>

            {campaignType === "existing" && existingCampaigns.length > 0 && (
              <div className="dropdownContainer">
                <div className="customDropdown">
                  <div
                    className="dropdownHeader"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {selectedCampaign
                      ? existingCampaigns.find((campaign) => campaign.id === selectedCampaign).name
                      : "Select a campaign"}
                  </div>
                  {dropdownOpen && (
                    <div className="dropdownList">
                      {existingCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="dropdownItem"
                          onClick={() => handleCampaignSelect({ target: { value: campaign.id } })}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCampaign === campaign.id}
                            onChange={() => handleCampaignSelect({ target: { value: campaign.id } })}
                          />
                          <span>{campaign.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              className="nextButton"
              onClick={() => handleShowForm("next")}
            >
              Next
            </button>
          </div>
        )}

        {formId === "newCampaignForm" && (
          <CampaignForm
            formId="newCampaign"
            onSubmit={() => toast.success("Mock submission successful!")}
            onEditConfig={handleEditConfig}
            onGoBack={() => handleShowForm("mainForm")}
            isNewCampaign={true}
            activeAccount={activeAccount}
            objective={config.objective}
          />
        )}

        {formId === "existingCampaignForm" && (
          <CampaignForm
            formId="existingCampaign"
            onSubmit={() => toast.success("Mock submission successful!")}
            onEditConfig={handleEditConfig}
            onGoBack={() => handleShowForm("mainForm")}
            isNewCampaign={false}
            activeAccount={activeAccount}
            campaignId={selectedCampaign}
            objective={config.objective}
          />
        )}

        {formId === "configForm" && (
          <ConfigForm
            activeAccount={activeAccount}
            initialConfig={config}
            onSaveConfig={handleSaveConfig}
            onCancel={handleCancelConfig}
            isNewCampaign={previousForm === "newCampaignForm"}
          />
        )}

        {formId === "progress" && (
          <div className="progressContainer">
            <ProgressBar progress={progress} step={step} stepVisible={stepVisible} />
            <button className="cancelButton" onClick={() => setFormId("mainForm")}>
              Cancel
            </button>
          </div>
        )}

        {formId === "successScreen" && (
          <SuccessScreen onGoBack={() => handleShowForm("mainForm")} />
        )}
      </div>
    </>
  );
};

export default Main;
