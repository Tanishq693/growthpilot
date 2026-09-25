from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseExecutor(ABC):
    @abstractmethod
    def execute_campaign(self, action_id: str, merchant_id: str, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        pass
